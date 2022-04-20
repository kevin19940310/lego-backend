import { Service } from 'egg';
import { UserProps } from '../model/user';
import * as $Dysmsapi from '@alicloud/dysmsapi20170525';
interface CreateByOauthProps {
  userName: string;
  city: string,
  avatar: string,
  nickName: string,
}
export default class UserService extends Service {
  public async createByEmail(payload: UserProps) {
    const { ctx } = this;
    const { userName, password } = payload;
    const hash = await ctx.genHash(password);
    const userCreatedData:Partial<UserProps> = {
      userName,
      password: hash,
      email: userName,
      type: 'email',
    };
    return ctx.model.User.create(userCreatedData);
  }
  public async createByPhone() {
    const { ctx } = this;
    const { phoneNumber } = ctx.request.body;
    const userCreatedData:Partial<UserProps> = {
      userName: phoneNumber,
      phoneNumber,
      type: 'cellphone',
      nickname: '测试' + phoneNumber.slice(-4),
    };
    return ctx.model.User.create(userCreatedData);
  }
  public async createByAliPayOauth(user:CreateByOauthProps) {
    const { ctx } = this;
    const userCreatedData:Partial<UserProps> = {
      userName: `aliPay${user.userName}`,
      picture: user.avatar,
      city: user.city,
      type: 'oauth',
      provider: 'aliPay',
      nickname: user.nickName,
      oauthId: user.userName,
    };
    return ctx.model.User.create(userCreatedData);
  }
  async findByUserName(username: string) {
    const result = await this.ctx.model.User.findOne({ userName: username });
    if (result) {
      return result;
    }
  }
  async sendSMS(phoneNumber: number, veriCode: string) {
    const { app } = this;
    const sendSMSRequest = new $Dysmsapi.SendSmsRequest({
      phoneNumbers: phoneNumber,
      signName: '阿里云短信测试',
      templateCode: 'SMS_154950909',
      templateParam: `{"code":"${veriCode}"}`,
    });
    const resp = await app.ALClient.sendSms(sendSMSRequest);
    return resp;
  }
  async aliOauthRequest() {
    const { app, ctx } = this;
    const { auth_code: code } = ctx.request.query;
    const resp = await app.ALOauth?.exec('alipay.system.oauth.token', {
      grantType: 'authorization_code',
      code,
      appId: app.config.aliSDkConfig.appid,
    });
    return resp;
  }
}
