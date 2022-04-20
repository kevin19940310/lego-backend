import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import * as dotenv from 'dotenv';
import { resolve } from 'path';
dotenv.config();
// pm2 start  npm --name eggjs   -- run dev

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649216294923_4910';

  // add your egg config in here
  config.middleware = [ 'customError' ];
  config.security = {
    csrf: false,
  };
  config.view = {
    defaultViewEngine: 'nunjucks',
  };
  config.cors = {
    origin: ' http://localhost:8081',
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS,HEAD,PATCH',
  };
  config.mongoose = {
    url: 'mongodb://localhost/lego',
  };
  config.multipart = {
    mode: 'file',
    tmpdir: resolve(appInfo.baseDir, './upload'),
  };
  config.static = {
    dir: [
      { prefix: '/public', dir: resolve(appInfo.baseDir, './app/public') },
      { prefix: '/upload', dir: resolve(appInfo.baseDir, './upload') },
    ],
  };
  config.bcrypt = {
    saltRounds: 10,
  };
  config.redis = {
    client: {
      port: 6379,
      host: 'localhost',
      password: '',
      db: 0,
    },
  };
  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
    baseUrl: 'default.url',
    jwt: {
      secret: '1234567890',
    },
    aliCloudConfig: {
      accessKeyId: process.env.accessKeyId,
      accessKeySecret: process.env.accessKeySecret,
      endpoint: 'dysmsapi.aliyuncs.com',
    },
    aliSDkConfig: {
      appid: '2021002145610429',
      privateKey: process.env.privateKey,
    },
    H5BaseURL: 'http://localhost:7001/api/pages',
  };

  // the return config will combines to EggAppConfig
  return {
    ...config as {},
    ...bizConfig,
  };
};
