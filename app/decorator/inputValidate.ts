import { Controller } from 'egg';
import { globalErrorMessagesType } from '../errorMessages';
// 创建工厂函数 传入rules 和 errorTypes
export default function validateInput(rules: any, errorType: globalErrorMessagesType) {
  return function(_protoType, _key: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;
    descriptor.value = function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { ctx, app } = that;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ ctx, errorType, error: errors });
      }
      return originalValue.apply(this, args);
    };
  };
}
