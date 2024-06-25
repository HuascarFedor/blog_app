import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  getUsers() {
    return this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userFound) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return userFound;
  }

  async createUser(user: CreateUserDto) {
    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });
    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete({ id });
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return result;
  }

  async updateUser(id: number, user: UpdateUserDto) {
    const userFoundById = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (!userFoundById) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    if (user.username) {
      const userFoundByName = await this.userRepository.findOne({
        where: {
          username: user.username,
        },
      });
      if (userFoundByName) {
        throw new HttpException('User already exists', HttpStatus.CONFLICT);
      }
    }
    const updateUser = Object.assign(userFoundById, user);
    return this.userRepository.save(updateUser);
  }
}
