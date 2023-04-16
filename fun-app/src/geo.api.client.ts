import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LocationDto } from "./users/dto/location.dto";


@Injectable()
export class GeoApiClient{

    constructor(
        private readonly httpService: HttpService
    ){}

    /**
     * 
     * @param lat double value representing latitude 
     * @param lon double value representing longitude
     * @returns locationDto object of state, city, country
     */
    public async getAddress(lat: number, lon: number): Promise<LocationDto> {
        const url = `https://api.geoapify.com/v1/geocode/reverse?apiKey=02d269dd5f0a49cf80121e4ac2deac0e`;

        const fullUrl = url + `&lat=${lat}&lon=${lon}`
        const response = await this.httpService.axiosRef.get(fullUrl);
        const locationDto = new LocationDto();
        locationDto.city = response.data.features[0].properties.city;
        locationDto.state = response.data.features[0].properties.state;
        locationDto.country = response.data.features[0].properties.country;
        return locationDto;
    }

}