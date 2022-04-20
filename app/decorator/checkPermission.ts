import { Controller } from 'egg';
import { globalErrorMessagesType } from '../errorMessages';
export default function checkPermission(modelName: string, errorType:globalErrorMessagesType, userKey = 'user') {
  return function(_protoType, _key: string, descriptor: PropertyDescriptor) {
    const originalValue = descriptor.value;
    descriptor.value = async function(...args: any[]) {
      const that = this as Controller;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const { ctx } = that;
      const { id } = ctx.params;
      const userID = ctx.state.user._id;
      const certianRecord = await ctx.model[modelName].findOne({ id });
      if (!certianRecord || certianRecord[userKey].toString() !== userID) {
        return ctx.helper.error({ ctx, errorType });
      }
      await originalValue.apply(this, args);
    };
  };
}
