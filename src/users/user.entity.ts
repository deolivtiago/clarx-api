import {
  Field,
  GraphQLISODateTime,
  HideField,
  ID,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field(() => ID!)
  id: string;

  @Field(() => String!)
  name: string | null;

  @Field(() => String!)
  email: string;

  @HideField()
  password: string;

  @Field(() => Boolean!)
  inactive: boolean;

  @Field(() => GraphQLISODateTime!)
  insertedAt: Date;

  @Field(() => GraphQLISODateTime!)
  updatedAt: Date;

  constructor(attrs: {
    id: string;
    name: string | null;
    email: string;
    password: string;
    inactive: boolean;
    insertedAt: Date;
    updatedAt: Date;
  }) {
    this.id = attrs.id;
    this.name = attrs.name;
    this.email = attrs.email;
    this.password = attrs.password;
    this.inactive = attrs.inactive;
    this.insertedAt = attrs.insertedAt;
    this.updatedAt = attrs.updatedAt;
  }
}
