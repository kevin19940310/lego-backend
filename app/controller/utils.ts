import { Controller } from 'egg';
import { createWriteStream } from 'fs';
import * as sendToWormhole from 'stream-wormhole'
import { pipeline } from 'stream/promises';
import * as sharp from 'sharp';
import { nanoid } from "nanoid";
import { parse, join, extname } from 'path';
import COS from "cos-nodejs-sdk-v5";

export default class UtilsController extends Controller {
  async fileLocalUpload() {
    const { ctx, app } = this;
    const { filepath } = ctx.request.files[0];
    // 生成 sharp 实例
    const imageSource = sharp(filepath)
    const metaData = await imageSource.metadata()
    app.logger.debug(metaData)
    let thumbnailUrl = ''
    // 检查图片宽度是否大于 300
    if (metaData.width && metaData.width > 300) {
      // generate a new file path
      // /uploads/**/abc.png =》 /uploads/**/abc-thumbnail.png
      const { name, ext, dir } = parse(filepath)
      app.logger.debug(name, ext, dir)
      const thumbnailFilePath = join(dir, `${name}-thumbnail${ext}`)
      await imageSource.resize({ width: 300 }).toFile(thumbnailFilePath)
      thumbnailUrl = thumbnailFilePath.replace(app.config.baseDir, app.config.baseUrl)
    }
    const url = filepath.replace(app.config.baseDir, app.config.baseUrl)
    ctx.helper.success({ ctx, res: { url, thumbnailUrl: thumbnailUrl ? thumbnailUrl : url } })
  }
  pathToURL(path: string) {
    const { app } = this
    return path.replace(app.config.baseDir, app.config.baseUrl)
  }
  async fileLocalUploadByStream() {
    const { ctx, app } = this;
    const stream = await ctx.getFileStream();
    const uid = nanoid(6)
    const savedFilePath = join(app.config.baseDir, 'upload', uid + extname(stream.filename))
    const savedThumbnailPath = join(app.config.baseDir, 'upload', uid + '_thumbnail' + extname(stream.filename))
    const target = createWriteStream(savedFilePath)
    const target2 = createWriteStream(savedThumbnailPath)
    const savePromise = pipeline(stream, target)
    const transformer = sharp().resize({ width: 300 })
    const thumbnailPromise = pipeline(stream, transformer, target2)
    try {
      await Promise.all([ savePromise, thumbnailPromise ])
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'imageUploadFail' })
    }
    ctx.helper.success({ ctx, res: { url: this.pathToURL(savedFilePath), thumbnailUrl: this.pathToURL(savedThumbnailPath) } })
  }
  async fileLocalUploadByTxCos() {
    const { ctx, app } = this;
    const cos = app.TXCOS;
    const stream = await ctx.getFileStream();
    const savedOSSPath = join('imooc-test', nanoid(6) + extname(stream.filename));
    const filePromise = new Promise<COS.PutObjectResult>((resolve, reject) => {
      cos?.putObject({
        Bucket: 'kevin1994-1258494266',
        Region: 'ap-chengdu',
        Key: savedOSSPath,
        Body: stream
      },function (err, data) {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    try {
      const data =  await filePromise;
      const { Location } = data;
      ctx.helper.success({ ctx, res: { url: Location } })
    } catch (e) {
      await sendToWormhole(stream);
      ctx.helper.error({ ctx, errorType: 'imageUploadFail' })
    }

  }

}
