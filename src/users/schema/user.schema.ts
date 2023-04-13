import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum UsersRole {
  user = 'user',
  admin = 'admin',
}

@Schema()
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop({ enum: UsersRole, default: UsersRole.user })
  role: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
