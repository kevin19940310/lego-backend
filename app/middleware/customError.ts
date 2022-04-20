import { Context } from 'egg';
export default () => {
  return async (ctx: Context, next: () => Promise<any>) => {
    try {
      await next();
    } catch (e) {
      const error = e as any;
      if (error && error.status === 401) {
        ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
      } else {
        throw e;
      }
    }
  };
};
