import { Application } from 'egg';

export default (app: Application) => {
  // const jwt = app.middleware.jwt({
  //   secret: app.config.jwt.secret,
  // });
  const { controller, router } = app;
  router.prefix('/api');
  router.post('/users/createByEmail', controller.user.createByEmail);
  router.get('/users/getUserInfo', controller.user.getUserInfo);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/sendVeriCode', controller.user.sendVeriCode);
  router.post('/users/loginByPhone', controller.user.loginByCellphone);
  router.get('/users/getAliToken', controller.user.getALIToken);
  router.post('/users/createByAliPay', controller.user.createByAliPay);

  router.post('/works', controller.work.createWork);
  router.get('/works', controller.work.myList);
  router.patch('/works/:id', controller.work.update);
  router.delete('/works/:id', controller.work.delete);
  router.post('/works/publish/:id', controller.work.publishWork);
  router.post('/works/publish-template/:id', controller.work.publishTemplate);

  router.post('/utils/upload', controller.utils.uploadMultipleFiles);
};
