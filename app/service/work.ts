import { Service } from 'egg';
import { WorkProps } from '../model/work';
import { Types } from 'mongoose';
import { nanoid } from 'nanoid';
import { IndexCondition } from '../controller/work';

const defaultIndexCondition:Required<IndexCondition> = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: '',
  customSort: { createdAt: -1 },
  find: {},
};

export default class WorkService extends Service {
  async createEmptyWork(payload) {
    const { ctx } = this;
    // 拿到userid
    const { _id, username } = ctx.state.user;
    const uuid = nanoid(6);
    const newEmptyWork: Partial<WorkProps> = {
      ...payload,
      user: Types.ObjectId(_id),
      author: username,
      uuid,
    };
    return ctx.model.Work.create(newEmptyWork);
  }
  async getList(condition: IndexCondition) {
    const FCondition = {
      ...defaultIndexCondition,
      ...condition,
    };
    const { pageIndex, pageSize, select, populate, customSort, find } = FCondition;
    const skip = (pageIndex - 1) * pageSize;
    const res = await this.ctx.model.Work
      .find(find)
      .select(select)
      .populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();
    const count = await this.ctx.model.Work.find(find).count();
    return {
      count,
      list: res,
      pageSize,
      pageIndex,
    };
  }
  async publish(id: number, isTemplate = false) {
    const { ctx, app } = this;
    const { H5BaseURL } = app.config;
    const payload: Partial<WorkProps> = {
      status: 2,
      latestPublishAt: new Date(),
      ...(isTemplate && { isTemplate: true }),
    };
    const res = await ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true });
    const { uuid } = res;
    return `${H5BaseURL}/p/${id}-${uuid}`;
  }
}
