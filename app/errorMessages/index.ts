import userError from './userError';
import workError from './workError';
import uploadError from "./uploadError";
export const globalErrorMessages = {
  ...userError,
  ...workError,
  ...uploadError,
};

export type globalErrorMessagesType = keyof (typeof userError & typeof workError & typeof uploadError);
