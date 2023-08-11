import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name?: string | null;

  @Field(() => String!)
  @IsString()
  @IsNotEmpty()
  @Transform((p) => p.value.toLowerCase())
  @IsEmail({}, { message: 'email must be valid' })
  @MaxLength(255)
  email: string;

  @Field(() => String!)
  @IsString()
  @IsNotEmpty()
  @Length(3, 255)
  password: string;

  @Field(() => Boolean)
  @IsOptional()
  @IsBoolean()
  inactive?: boolean;
}
