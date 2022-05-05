import { Context, EggAppConfig } from 'egg';
import { verify } from 'jsonwebtoken';

function getTokenValue(ctx: Context) {
  const { authorization } = ctx.header;
  if (!ctx.header || !authorization) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      const schema = parts[0];
      const token = parts[1];
      if (/^Bearer$/i.test(schema)) {
        return token;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
}
export default (options: EggAppConfig['jwt']) => {
  return async (ctx: Context, next: () => Promise<any>) => {
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    const { secret } = options;
    if (!secret) {
      throw new Error('Secret not provided');
    }
    try {
      ctx.state.user = verify(token, secret);
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    await next();
  };
};
