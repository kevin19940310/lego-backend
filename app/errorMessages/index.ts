import userError from './userError';
import workError from './workError';
export const globalErrorMessages = {
  ...userError,
  ...workError,
};

export type globalErrorMessagesType = keyof (typeof userError & typeof workError);
