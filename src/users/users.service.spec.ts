import { Test, TestingModule } from '@nestjs/testing';
import { GraphQLError } from 'graphql';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

const fakeUsers = [
  new User({
    id: 'a5004c65-b274-4bea-8009-8ebf5893ba6f',
    name: 'Some Name',
    email: 'some@mail.com',
    password: 'some-password.hash',
    inactive: false,
    insertedAt: new Date('2023-02-13T12:13:00-03:00'),
    updatedAt: new Date('2023-03-25T08:10:46-03:00'),
  }),
  new User({
    id: 'cb92a54f-f040-4d34-81c0-bed1951d3b28',
    name: 'Another Name',
    email: 'another@mail.com',
    inactive: true,
    password: 'another.password-hash',
    insertedAt: new Date('2022-12-22T05:23:42-03:00'),
    updatedAt: new Date('2023-03-16T12:38:30-03:00'),
  }),
];

const prismaServiceMock = {
  user: {
    create: jest.fn().mockResolvedValue(fakeUsers[0]),
    findMany: jest.fn().mockResolvedValue(fakeUsers),
    findUnique: jest.fn().mockResolvedValue(fakeUsers[0]),
    update: jest.fn().mockResolvedValue(fakeUsers[0]),
    delete: jest.fn().mockResolvedValue(fakeUsers[0]),
  },
};

describe('UsersService', () => {
  let sut: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        PrismaService,
      ],
    }).compile();

    sut = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // afterEach(() => {
  //   jest.clearAllMocks();
  // });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(fakeUsers);

      const users = await sut.findAll();

      expect(users).toEqual(fakeUsers);
      expect(prismaService.user.findMany).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findMany).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it(`should return a single user`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(fakeUsers[0]);

      const id = fakeUsers[0].id;

      const user = await sut.findOne(id);

      expect(user).toEqual(fakeUsers[0]);
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it(`should raise an error when id is invalid`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const id = '123';

      await expect(sut.findOne(id)).rejects.toThrowError(new GraphQLError(`invalid UUID: ${id}`));
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it(`should raise an error when user is not found`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const id = '47a4a58f-32b3-4ff7-9f37-2253d3c9d628';

      await expect(sut.findOne(id)).rejects.toThrowError(new GraphQLError(`User not found: ${id}`));
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('create', () => {
    it(`should create a new user`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(fakeUsers[0]);

      const { name, email } = fakeUsers[0];
      const input = { name, email, password: 'any.password' };

      const user = await sut.create(input);

      expect(user).toEqual(fakeUsers[0]);
      expect(prismaService.user.create).toHaveBeenCalledTimes(1);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: { name, email, password: input.password },
      });
    });

    it(`should raise an error when user already exists`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(fakeUsers[0]);

      const { name, email } = fakeUsers[0];
      const input = { name, email, password: 'any.password' };

      await expect(sut.create(input)).rejects.toThrowError(new GraphQLError(`User already exists: ${email}`));
      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('update', () => {
    it(`should update an user`, async () => {
      jest.spyOn(sut, 'findOne').mockResolvedValue(fakeUsers[0]);
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(fakeUsers[0]);

      const { id, name, email } = fakeUsers[0];
      const input = { name, email, password: 'any.password' };

      const user = await sut.update(id, input);

      expect(user).toEqual(fakeUsers[0]);
      expect(prismaService.user.update).toHaveBeenCalledTimes(1);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id },
        data: input,
      });
    });
  });

  describe('remove', () => {
    it(`should remove an user`, async () => {
      jest.spyOn(sut, 'findOne').mockResolvedValue(fakeUsers[0]);
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(fakeUsers[0]);

      const { id } = fakeUsers[0];

      const user = await sut.remove(id);

      expect(user).toEqual(fakeUsers[0]);
      expect(prismaService.user.delete).toHaveBeenCalledTimes(1);
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });

    it(`should raise an error when user is not found`, async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      const id = '47a4a58f-32b3-4ff7-9f37-2253d3c9d628';

      await expect(sut.remove(id)).rejects.toThrowError();

      expect(prismaService.user.findUnique).toHaveBeenCalledTimes(1);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
