import 'egg';
import { Mongoose, Model } from 'mongoose';
import { UserProps } from '../app/model/user';

declare module 'egg' {
  // type mongooseType = {
  //   [key: string] : Model<any>
  // }
  // interface Application {
  //   mongoose: Mongoose,
  //   model: mongooseType
  // }
  interface MongooseModels extends IModel{
    [key: string]: Model<any>
  }
  interface Context {
    genHash(plainText: string): Promise<string>,
    compare(plainText: string, hash: string):Promise<boolean>,
  }
  interface EggAppConfig {
    bcrypt: {
      saltRounds: number
    },
    jwt: {
      secret: string;
      enable?: boolean;
      match?: string[];
    }
  }
}
