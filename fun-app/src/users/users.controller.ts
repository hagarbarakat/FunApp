import { Controller, Get, Post, Body, ParseIntPipe, Param, ValidationPipe, UsePipes, HttpStatus, Res, HttpException, NotFoundException, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}


  /**
   * 
   * @param createUserDto CreateUserDto object to be passed to service layer and added in database
   * @throws BadRequestException when country isn't USA 
   * @returns newUser User created in database
   * 
   */
  @Post("signup")
  @UsePipes(ValidationPipe)
  async create (@Body() createUserDto: CreateUserDto) {

    try {
       return await this.usersService.create(createUserDto);       
    }
    catch(error){
      throw new BadRequestException(error.message, error.code);
    }
  }

 /**
   * 
   * @param id number representing id of user in database 
   * @throws NotFoundException when user isn't found
   * @returns user user found in database
   * 
  */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: string) {
    try {
      return await this.usersService.findOne(+id);
    } catch (error) {
      throw new NotFoundException(error.message, error.code);
    }
  }

}
