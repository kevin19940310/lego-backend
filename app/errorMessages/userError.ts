export default {
  userInputValidateFail: {
    errno: 1010001,
    message: '输入信息验证失败',
  },
  // 创建用户，用户已存在
  createUserAlreadyExists: {
    errno: 1010002,
    message: '该邮箱已经被注册了，请直接登录',
  },
  // 用户不存在或密码错误
  loginCheckFailInfo: {
    errno: 1010003,
    message: '该用户不存在或密码错误',
  },
  // 登录验证
  loginValidateFail: {
    errno: 1010004,
    message: '登录验证失败',
  },
  // 发送短信过于频繁
  sendVeriCodeFrequentlyFailInfo: {
    errno: 1010005,
    message: '请勿频繁获取短信验证码',
  },
  // 验证码校验错误
  veriCodeValidateFail: {
    errno: 1010006,
    message: '验证码输入错误',
  },
  // 验证码发送失败
  veriCodeSendFail: {
    errno: 1010007,
    message: '验证码发送失败',
  },
  // 获取支付宝用户信息失败
  getAliPayUserFail: {
    errno: 1010008,
    message: '获取支付宝用户信息失败',
  },
};
