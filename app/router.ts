import { Application } from 'egg';

export default (app: Application) => {
  const jwt = app.middleware.jwt({
    secret: app.config.jwt.secret,
  });
  const { controller, router } = app;
  router.post('/api/users/createByEmail', controller.user.createByEmail);
  router.get('/api/users/getUserInfo', jwt, controller.user.getUserInfo);
  router.post('/api/users/loginByEmail', controller.user.loginByEmail);
  router.post('/api/users/sendVeriCode', controller.user.sendVeriCode);
  router.post('/api/users/loginByPhone', controller.user.loginByCellphone);
  router.get('/api/users/getAliToken', controller.user.getALIToken);
  router.post('/api/users/createByAliPay', controller.user.createByAliPay);

  router.post('/api/works', jwt, controller.work.createWork);
  router.get('/api/works', jwt, controller.work.myList);
  router.patch('/api/works/:id', jwt, controller.work.update);
  router.delete('/api/works/:id', jwt, controller.work.delete);
  router.post('/api/works/publish/:id', jwt, controller.work.publishWork);
  router.post('/api/works/publish-template/:id', jwt, controller.work.publishTemplate);
  router.post('/api/utils/upload', controller.utils.fileLocalUpload);
};
