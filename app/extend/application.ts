import { Application } from 'egg';
const ALCLIENT = Symbol('application#ALClient');
import Dysmsapi from '@alicloud/dysmsapi20170525';
import * as $OpenApi from '@alicloud/openapi-client';
import AlipaySdk from 'alipay-sdk';
const COS = require('cos-nodejs-sdk-v5');
export default {
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
  get TXCOS() {
    const that = this as Application
    const { SecretId, SecretKey } = that.config.txSDKConfig;
    if (SecretId && SecretKey) {
      const txCOS = new COS({
        SecretId,
        SecretKey
      })
      return txCOS
    }
    return null
  }
};
