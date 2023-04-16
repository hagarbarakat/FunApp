import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { GeoApiClient } from '../../geo.api.client';
import { HttpModule } from '@nestjs/axios'; 
import { Repository } from 'typeorm';


describe('The UsersService', () => {
  let usersService: UsersService;
  let userRepo: Repository<User>;

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
    userRepo =  module.get<Repository<User>>(getRepositoryToken(User));

  })

  describe('when getting a user by id', () => {
    describe('and the user is matched', () => {
      let user: User;
      beforeEach(() => {
        user = {
          id: 1, 
          name: "hagarbarakat",
          email: "hagarbarakat97@gmail.com",
          state: "California",
          city: "test"
      };
        jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(user));
      })
      it('should return the user', async () => {
        const fetchedUser = await usersService.findOne(1);
        expect(fetchedUser).toEqual(user);
      })
    })
    describe('and the user is not matched', () => {
      beforeEach(() => {
        jest
        .spyOn(userRepo, 'findOneBy')
        .mockImplementationOnce(() => Promise.resolve(null));
      })

      it('should throw an error', async () => {
         await expect(usersService.findOne(30)).rejects.toThrow();
      })
    })
  })
});
