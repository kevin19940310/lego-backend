import { Application } from 'egg';
import Axios, { AxiosInstance } from 'axios';
const AXIOS = Symbol('applicationAxios');
const ALCLIENT = Symbol('application#ALClient');
import Dysmsapi from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import AlipaySdk from 'alipay-sdk';
export default {
  echo(msg: string) {
    const that = this as Application;
    return `hello ${msg}${that.config.name}`;
  },
  get axiosInstance():AxiosInstance {
    if (!this[AXIOS]) {
      this[AXIOS] = Axios.create({
        baseURL: 'https://dog.ceo/',
        timeout: 5000,
      });
    }
    return this[AXIOS];
  },
  get ALClient(): Dysmsapi {
    const that = this as Application;
    const { accessKeyId, accessKeySecret, endpoint } = that.config.aliCloudConfig;
    if (!this[ALCLIENT]) {
      const config = new $OpenApi.Config({
        accessKeySecret,
        accessKeyId,
      });
      config.endpoint = endpoint;
      this[ALCLIENT] = new Dysmsapi(config);
    }
    return this[ALCLIENT];
  },
  get ALOauth(): AlipaySdk | null {
    const that = this as Application;
    const { appid, privateKey } = that.config.aliSDkConfig;
    if (appid && privateKey) {
      const alipaySdk = new AlipaySdk({
        // 参考下方 SDK 配置
        appId: appid,
        privateKey,
      });
      return alipaySdk;
    }
    return null;
  },
};
