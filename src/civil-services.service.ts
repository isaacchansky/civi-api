import { Component } from '@nestjs/common';
import * as WebRequest from 'web-request';

@Component()
export class CivilServicesService {
  private readonly API_URL = "https://api.civil.services/v1/government/";
  private readonly API_KEY = process.env.CIVIL_SERVICES_API_KEY;

  async findRepresentativesByZip(zip: string) {
    let result = await WebRequest.json(`${this.API_URL}?apikey=${this.API_KEY}&zipcode=${zip}&page=1&pageSize=50&fields=house%2Csenate`, {headers: {'Content-Type': 'application/json'}})
    return result;
   }
}
