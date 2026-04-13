import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //crate a face copy of the users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('create a new user with a salted and hashed password', async () => {
    const user = await service.signup('hello@gamil.com', 'pass');

    expect(user.password).not.toEqual('pass');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throw an error if user signs up with email that is in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([{ id: 1, email: 'q', password: 'd' } as User]);
    await service.signup('hello@gamil.com', 'pass');

    await expect(service.signup('hello@gamil.com', 'pass')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws if login is called with an unused email', async () => {
    await expect(service.login('asdb@kjbds.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws if an invalid password is provided ', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'new@user.com',
    //       password:
    //         'a022d7f4d76fb90c.9bf589951f5fb4e396436daebb8f6bebd569fb3e4a7a150b7b013a1af511ffed',
    //     } as User,
    //   ]);
    await service.signup('asd@asd.com', 'pass666');
    await expect(service.login('asd@asd.com', 'pass6661')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('return a user if correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'new@user.com',
    //       password:
    //         'a022d7f4d76fb90c.9bf589951f5fb4e396436daebb8f6bebd569fb3e4a7a150b7b013a1af511ffed',
    //     } as User,
    //   ]);

    await service.signup('asd@asd.com', 'pass666');
    const user = await service.login('asd@asd.com', 'pass666');

    expect(user).toBeDefined();
  });
});
