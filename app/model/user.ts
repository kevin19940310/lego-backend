import { Application } from 'egg';
import * as AutoIncrementFactor from 'mongoose-sequence';

export interface UserProps {
  userName: string;
  password: string;
  email?: string;
  nickname?: string;
  picture?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
  city: string;
  type: 'email' | 'cellphone' | 'oauth';
  provider: 'aliPay';
  oauthId: string;
}

function initUserModel(app: Application) {
  const mongoose = app.mongoose;
  const AutoIncrement = AutoIncrementFactor(mongoose);
  const Schema = mongoose.Schema;
  const UserSchema = new Schema<UserProps>({
    userName: { type: String, unique: true, required: true },
    password: { type: String },
    nickname: { type: String },
    picture: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    city: { type: String },
    type: { type: String, default: 'email' },
    provider: { type: String },
    oauthId: { type: String },
  }, {
    timestamps: true,
    toJSON: { transform(_, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret._id;
    } } },
  );
  UserSchema.plugin(AutoIncrement, {
    inc_field: 'id',
    id: 'users_id_counter',
  });
  return mongoose.model<UserProps>('User', UserSchema);
}

export default initUserModel;
