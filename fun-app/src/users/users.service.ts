import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GeoApiClient } from '.././geo.api.client';
import { UserDto } from './dto/user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly geoApiClient: GeoApiClient
  ) {}

    /**
     * 
     * @param createUserDto CreateUserDto object to be added in database
     * @throws Error when country isn't USA 
     * @returns newUser Promise of User created in database
     * 
     */

  async create(createUserDto: CreateUserDto): Promise<User> {

    const location = await this.geoApiClient.getAddress(createUserDto.lat, createUserDto.long);

    if(location.country != 'United States'){
      throw new Error("LAT and LONG are not in USA");
    }

    const createUser: UserDto = {
      name: createUserDto.name,
      state: location.state,
      city: location.city,
      email: createUserDto.email
    }

    const newUser = this.usersRepository.save(createUser);
    return newUser;

  }
  
  /**
   * 
   * @param id number representing id of user in database 
   * @throws Error when user isn't found
   * @returns user Promise of User found in database
   * 
  */
  async findOne(id: number): Promise<User> {
    
    const user = await this.usersRepository.findOneBy({ id });
    if(user == null)
      throw new Error("User is not found");
    return user;

  }

}
