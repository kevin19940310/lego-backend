// import { Application, Context, EggAppConfig } from 'egg';
// import fs = require('fs');
// export default (options: EggAppConfig['myLogger'], app: Application) => {
//   return async (ctx: Context, next: () => Promise<any>) => {
//     console.log(app);
//     const startTime = Date.now();
//     const requestTime = new Date();
//     await next();
//     const ms = Date.now() - startTime;
//     const logTime = `${requestTime} -- ${ctx.method} -- ${ctx.url} -- ${ms}ms`;
//     if (options.allowedMethods.includes(ctx.method)) {
//       fs.appendFileSync('./log.txt', logTime + '\n');
//     }
//   };
// };
