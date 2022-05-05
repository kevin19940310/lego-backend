import { Application, IBoot } from 'egg';

export default class AppBoot implements IBoot {
  private readonly app: Application;
  constructor(app: Application) {
    this.app = app;
    // const { url } = this.app.config.mongoose;
    // assert(url, 'url is required on config');
    // const db = createConnection(`${url}hello`);
    // db.on('connected', () => {
    //   app.logger.info(`${url} 链接成功`);
    // });
    // app.mongoose = db;
  }
  configWillLoad() {
    // 只支持同步调用
    // console.log('config', this.app.config.baseUrl);
    // this.app.config.coreMiddleware.unshift('myLogger');
    // console.log('middleware', this.app.config.coreMiddleware);
    this.app.config.coreMiddleware.push('customError');
  }
  async willReady() {
    // const dir = join(this.app.config.baseDir, 'app/model');
    // this.app.loader.loadToApp(dir, 'model', {
    //   caseStyle: 'upper',
    // });
    // console.log('middleware', this.app.config.coreMiddleware);
  }
}
