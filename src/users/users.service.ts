import { Injectable } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateUserInput): Promise<User> {
    const userExists = await this.prismaService.user.findUnique({
      where: { email: input.email },
    });

    if (userExists) {
      throw new GraphQLError(`User already exists: ${input.email}`, {
        extensions: { code: 'ALREADY_EXISTS_ERROR' },
      });
    }

    const data = await this.prismaService.user.create({
      data: input,
    });

    return new User({ ...data });
  }

  async findAll(): Promise<User[]> {
    return await this.prismaService.user.findMany();
  }

  async findOne(id: string): Promise<User> {
    const data = await this.prismaService.user.findUnique({ where: { id } });

    if (!data) {
      throw new GraphQLError(`User not found: ${id}`, {
        extensions: { code: 'NOT_FOUND_ERROR' },
      });
    }

    return new User({ ...data });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    await this.findOne(id);

    const data = await this.prismaService.user.update({
      where: { id },
      data: input,
    });

    return new User({ ...data });
  }

  async remove(id: string): Promise<User> {
    await this.findOne(id);

    const data = await this.prismaService.user.delete({ where: { id } });

    return new User({ ...data });
  }
}
