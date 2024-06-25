import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException } from '@nestjs/common';

const mockUserRepositroy = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepositroy(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('getUsers', () => {
    it('debería retornar todos los usuarios', async () => {
      const users = [
        {
          id: 1,
          username: 'testuser1',
          password: 'Password$123',
        },
        {
          id: 2,
          username: 'testuser2',
          password: 'Password$123',
        },
      ];
      //Mockear la respuesta del método find del userRepository
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);
      //Llamar al método getUsers del servicio
      const result = await service.getUsers();
      //Verificar que el método find fue invocado
      expect(userRepository.find).toHaveBeenCalled();
      //Verificar que el resultado retornado sea igual a los usuarios simulados
      expect(result).toEqual(users);
    });
  });

  describe('getUser', () => {
    it('debería retornar excepción de no encontrado', async () => {
      const userId = 1;
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.getUser(userId)).rejects.toThrow(HttpException);
      await expect(service.getUser(userId)).rejects.toThrow('User not found');
    });

    it('debería retornar un registro', async () => {
      const userId = 1;
      const user = {
        id: userId,
        username: 'testuser',
        password: 'Password$123',
      };
      userRepository.findOne.mockResolvedValue(user);

      const result = await service.getUser(userId);
      expect(userRepository.findOne).toHaveBeenCalled();
      expect(result).toEqual(user);
    });
  });

  describe('createUser', () => {
    it('Debería retornar excepción por nombre repetido', async () => {
      const user = {
        username: 'testuser',
        password: 'Password$123',
      };
      userRepository.findOne.mockResolvedValue(user);
      await expect(service.createUser(user)).rejects.toThrow(HttpException);
      await expect(service.createUser(user)).rejects.toThrow(
        'User already exists',
      );
    });

    it('Debería crear y retornar el usuario', async () => {
      const user = {
        username: 'testuser',
        password: 'Password$123',
      };
      const createdUser = { id: 1, ...user };
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue(createdUser);
      userRepository.save.mockResolvedValue(createdUser);

      const result = await service.createUser(user);
      expect(userRepository.create).toHaveBeenCalledWith(user);
      expect(userRepository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(createdUser);
    });
  });

  describe('deleteUser', () => {
    it('Debería retornar una excepción por usuario no encontrado', async () => {
      const userId = 1;
      userRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.deleteUser(userId)).rejects.toThrow(HttpException);
      await expect(service.deleteUser(userId)).rejects.toThrow(
        'User not found',
      );
    });

    it('Deberia eliminar al usuario', async () => {
      const userId = 1;
      const deleteResult = { affected: 1 };
      userRepository.delete.mockResolvedValue(deleteResult);
      const result = await service.deleteUser(userId);
      expect(userRepository.delete).toHaveBeenCalledWith({ id: userId });
      expect(result).toEqual(deleteResult);
    });
  });
});
