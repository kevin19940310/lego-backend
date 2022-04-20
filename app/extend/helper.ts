import { Context } from 'egg';
import { globalErrorMessages, globalErrorMessagesType } from '../errorMessages';
interface ResponseType {
  ctx: Context;
  res?: any;
  msg?: string;
}
interface ErrorResponseType {
  ctx: Context;
  errorType: globalErrorMessagesType,
  error?: any;
}
export default {
  success({ ctx, res, msg } : ResponseType) {
    ctx.body = {
      errno: 0,
      data: res ? res : null,
      message: msg ? msg : '请求成功',
    };
    ctx.status = 200;
  },
  error({ ctx, errorType, error } : ErrorResponseType) {
    const { message, errno } = globalErrorMessages[errorType];
    ctx.body = {
      errno,
      message,
      ...(error && { error }),
    };
    ctx.status = 200;
  },
};
