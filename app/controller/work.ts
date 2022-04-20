import { Controller } from 'egg';
import inputValidate from '../decorator/inputValidate';
import checkPermission from '../decorator/checkPermission';

const workCreateRules = {
  title: 'string',
};

export interface IndexCondition {
  pageIndex?: number;
  pageSize?: number;
  select?: string | string[];
  populate?: { path?: string; select: string | string[]; } | string;
  customSort?: Record<string, any>;
  find?: Record<string, any>;
}

export default class WorkController extends Controller {
  @inputValidate(workCreateRules, 'workValidateFail')
  async createWork() {
    const { ctx, service } = this;
    const workData = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: workData, msg: '创建成功' });
  }
  async myList() {
    const { ctx, service } = this;
    const userID = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userID,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: {
        path: 'user',
        select: 'userName nickname picture',
      },
      find: findCondition,
      ...(pageSize && { pageSize: parseInt(pageSize) }),
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),

    };
    const data = await service.work.getList(listCondition);
    ctx.helper.success({ ctx, res: data });
  }
  async templateList() {
    const { ctx, service } = this;
    const { pageIndex, pageSize } = ctx.query;
    const listCondition: IndexCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createdAt',
      populate: {
        path: 'user',
        select: 'userName nickname picture',
      },
      find: { isTemplate: true, isPublic: true },
      ...(pageSize && { pageSize: parseInt(pageSize) }),
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),

    };
    const data = await service.work.getList(listCondition);
    ctx.helper.success({ ctx, res: data });
  }
  @checkPermission('Work', 'workPermissionFail')
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const payload = ctx.request.body;
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work', 'workPermissionFail')
  async delete() {
    const { ctx } = this;
    const { id } = ctx.params;
    const res = await ctx.model.Work.findOneAndDelete({ id }).select('_id id title').lean();
    ctx.helper.success({ ctx, res });
  }
  @checkPermission('Work', 'workPermissionFail')
  async publish(isTemplate: boolean) {
    const { ctx, service } = this;
    const url = await service.work.publish(ctx.params.id, isTemplate);
    ctx.helper.success({ ctx, res: { url } });
  }
  async publishWork() {
    await this.publish(false);
  }
  async publishTemplate() {
    await this.publish(true);
  }
}
