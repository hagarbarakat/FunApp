import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { GeoApiClient } from '../../geo.api.client';
import { HttpModule } from '@nestjs/axios'; 
import { CreateUserDto } from '../dto/create-user.dto';
import { LocationDto } from '../dto/location.dto';
import { Repository } from 'typeorm';

describe('The UsersService', () => {
  let usersService: UsersService;
  let userRepo: Repository<User>;
  let geoApiClient: GeoApiClient;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), 
          useClass: Repository,
        },
         GeoApiClient],
        imports: [HttpModule]
    })
      .compile();
    usersService = await module.get(UsersService);
    geoApiClient = await module.get(GeoApiClient);
    userRepo =  module.get<Repository<User>>(getRepositoryToken(User));
  })

  describe('when creating a user', () => {
    let location: LocationDto; 
    let user: CreateUserDto; 
    let mockedUser: User;

    describe('and the user is in USA', () => {
        beforeEach(() => {
            location = {
                city: "Westfield", 
                state: "Massachusetts", 
                country: "United States"
            };
            user = {
                name: "hagarbarakat",
                email: "hagarbarakat97@gmail.com",
                lat:  42.084487,
                long: -72.736905 
            };
            mockedUser = {
                id: 1, 
                name: "hagarbarakat",
                email: "hagarbarakat97@gmail.com",
                city: "Westfield", 
                state: "Massachusetts", 
            };

            jest
            .spyOn(geoApiClient, 'getAddress')
            .mockImplementationOnce(() => Promise.resolve(location));
    
            jest
            .spyOn(userRepo, 'save')
            .mockImplementationOnce(() =>Promise.resolve(mockedUser));
        });
        it('should create a new user', async () => {

            const result = await usersService.create(user);
      
            expect(result).toEqual(mockedUser);
        })
    }),
    describe('and the user is not in USA', () => {
            let location: LocationDto; 
            beforeEach(() => {
                location = new LocationDto;
                location.country = "Egypt";
                jest
                .spyOn(geoApiClient, 'getAddress')
                .mockImplementationOnce(() => Promise.resolve(location));
            });
            it('should not create a new user and throw error', async () => {
                await expect(usersService.create(user)).rejects.toThrow();

            });
        });
    });
});