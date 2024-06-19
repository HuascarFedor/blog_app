import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockUserRepositroy = () => ({
  find: jest.fn(),
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
});
