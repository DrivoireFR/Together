import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return user;
    } catch (err) {
      console.log(err)
      throw new BadRequestException();
    }
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    console.log(users)
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const res = await this.usersService.findOne(+id);
      console.log(res)
      return res
    } catch (err) {
      console.log(err)
      throw new NotFoundException();
    }
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
