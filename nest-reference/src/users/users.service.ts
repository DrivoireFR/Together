import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { validate } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User | Error> {
    const existingUser = await this.usersRepository.findOne({
      where: [
        { email: createUserDto.email },
      ]
    });

    if (existingUser) {
      throw new Error('Cet utilisateur existe déjà')
    }

    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.role = createUserDto.role;

    const errors = await validate(user);
    if (errors.length > 0) {
      // console.log(errors)
      throw new Error('Bad request');
    };

    try {
      await this.usersRepository.save(user);
    }
    catch (err) {
      throw new Error(err)
    }

    return user;
  }

  findAll() {
    return this.usersRepository.find();
  }

  async findOne(id: number): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new Error('Utilisateur non trouvé')
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
