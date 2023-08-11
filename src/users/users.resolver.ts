import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User!)
  async createUser(
    @Args('input', { type: () => CreateUserInput! }) input: CreateUserInput,
  ): Promise<User> {
    return await this.usersService.create(input);
  }

  @Query(() => [User]!, { name: 'users' })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Query(() => User!, { name: 'user' })
  async findOne(
    @Args('id', { type: () => ID! }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Mutation(() => User!)
  async updateUser(
    @Args('id', { type: () => ID! }, ParseUUIDPipe) id: string,
    @Args('input', { type: () => UpdateUserInput! }) input: UpdateUserInput,
  ): Promise<User> {
    return await this.usersService.update(id, input);
  }

  @Mutation(() => User!)
  async removeUser(
    @Args('id', { type: () => ID! }, ParseUUIDPipe) id: string,
  ): Promise<User> {
    return await this.usersService.remove(id);
  }
}
