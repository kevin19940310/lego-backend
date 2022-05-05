import { Controller } from 'egg';
import { sign } from 'jsonwebtoken';
import inputValidate from '../decorator/inputValidate';

const userCreatedRules = {
  userName: 'email',
  password: { type: 'password', min: 8 },
};

const sendCodeRules = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
};

const userPhoneCreateRule = {
  phoneNumber: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
  veriCode: { type: 'string', format: /^\d{4}$/, message: '验证码输入错误' },
};
export interface AliPayUserInfo {
  avatar: string;
  city: string;
  code: string;
  msg: string;
  nickname: string;
  province: string;
  userId: string;
}

export default class UserController extends Controller {
  // 邮箱注册
  @inputValidate(userCreatedRules, 'userInputValidateFail')
  public async createByEmail() {
    const { ctx, service } = this;
    const user = await service.user.findByUserName(ctx.request.body.userName);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData, msg: '注册成功' });
  }
  // 邮箱登录
  @inputValidate(userCreatedRules, 'userInputValidateFail')
  async loginByEmail() {
    const { ctx, service, app } = this;
    // 获取用户信息
    const { userName, password } = ctx.request.body;
    const user = await service.user.findByUserName(userName);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }
    // const userObj = user.toJSON();
    // ctx.cookies.set('userName', user.userName, { encrypt: true });
    // ctx.session.userName = user.userName;
    const secret = app.config.jwt.secret;
    if (!secret) {
      throw new Error('Secret not provided');
    }
    const token = sign({ username: user.userName, _id: user._id }, secret, { expiresIn: 60 * 60 });
    return ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }
  // 获取用户信息
  async getUserInfo() {
    const { service, ctx } = this;
    // const { userName } = ctx.session;
    // const userName = ctx.cookies.get('userName', { encrypt: true });
    // const userData = await service.user.findById(ctx.query.id);
    // if (!userName) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    // JWT
    // const token = this.getTokenValue();
    // if (!token) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    // try {
    //   const decoded = verify(token, app.config.secret);
    //   ctx.helper.success({ ctx, res: decoded });
    // } catch (e) {
    //   return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    // }
    // ctx.helper.success({ ctx, res: userName });
    const userData = await service.user.findByUserName(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData });
  }
  // 获取手机验证码
  @inputValidate(sendCodeRules, 'userInputValidateFail')
  async sendVeriCode() {
    const { ctx, app } = this;
    const { phoneNumber } = ctx.request.body;
    // 获取redis 数据
    const perVeriCode = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (perVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyFailInfo' });
    }
    const veriCode = (Math.floor(((Math.random() * 9000)) + 1000)).toString();
    if (app.config.env === 'prod') {
      // 发送短信
      const resp = await this.service.user.sendSMS(phoneNumber, veriCode);
      if (resp.body.code !== 'OK') {
        return ctx.helper.error({ ctx, errorType: 'veriCodeSendFail' });
      }
    }

    await app.redis.set(`phoneVeriCode-${phoneNumber}`, veriCode, 'ex', 60);
    ctx.helper.success({ ctx, msg: '验证码发送成功', res: app.config.env === 'local' ? { veriCode } : null });
  }
  // 手机登录
  @inputValidate(userPhoneCreateRule, 'userInputValidateFail')
  async loginByCellphone() {
    const { ctx, app, service } = this;
    const { phoneNumber, veriCode } = ctx.request.body;
    // 验证码是否正确
    const code = await app.redis.get(`phoneVeriCode-${phoneNumber}`);
    if (veriCode !== code) {
      return ctx.helper.error({ ctx, errorType: 'veriCodeValidateFail' });
    }
    let user = await service.user.findByUserName(phoneNumber);
    if (!user) {
      user = await service.user.createByPhone();
    }
    const secret = app.config.jwt.secret;
    if (!secret) {
      throw new Error('Secret not provided');
    }
    const token = sign({ username: user.userName, _id: user._id }, secret, { expiresIn: 60 * 60 });
    return ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
  }
  // 获取支付宝token
  async getALIToken() {
    const { service, ctx } = this;
    const resp = await service.user.aliOauthRequest();
    if (resp) {
      await ctx.render('../view/test.nj', { token: resp.accessToken });
    }
  }
  // 支付宝登录
  async createByAliPay() {
    const { ctx, app, service } = this;
    const { token } = ctx.request.body;
    if (token) {
      const data = await app.ALOauth?.exec<AliPayUserInfo>('alipay.user.info.share', {
        authToken: token,
        appId: app.config.aliSDkConfig.appid,
      });
      if (data && data.code === '10000') {
        let user = await service.user.findByUserName(`aliPay${data.userId}`);
        if (!user) {
          user = await service.user.createByAliPayOauth({
            userName: data.userId,
            city: data.city,
            avatar: data.avatar,
            nickName: data.nickName,
          });
        }
        const secret = app.config.jwt.secret;
        if (!secret) {
          throw new Error('Secret not provided');
        }
        const token = sign({ username: user.userName, _id: user._id }, secret, { expiresIn: 60 * 60 });
        return ctx.helper.success({ ctx, res: { token }, msg: '登录成功' });
      }
      return ctx.helper.error({ ctx, errorType: 'getAliPayUserFail', error: '登录失败' });
    }
  }
}
