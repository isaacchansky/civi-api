import { Component } from '@nestjs/common';
import * as WebRequest from 'web-request';

@Component()
export class GoogleCivicService {
  private readonly REP_API_URL = "https://www.googleapis.com/civicinfo/v2/representatives";
  private readonly ELECTION_API_URL = "https://www.googleapis.com/civicinfo/v2/elections";
  private readonly VOTER_INFO_API_URL = "https://www.googleapis.com/civicinfo/v2/voterinfo";
  private readonly API_KEY = process.env.GOOGLE_CIVIC_API_KEY;

  async findRepresentativesByZip(zip: string) {
    let result = await WebRequest.json(`${this.REP_API_URL}?key=${this.API_KEY}&address=${zip}`, {headers: {'Content-Type': 'application/json'}});
    return result;
  }

  async findElections() {
    let result = await WebRequest.json(`${this.ELECTION_API_URL}?key=${this.API_KEY}`, {headers: {'Content-Type': 'application/json'}});
    return result;
  }

  async findVoterInfo(address: string) {
    let result = await WebRequest.json(`${this.VOTER_INFO_API_URL}?key=${this.API_KEY}&address=${address}`, {headers: {'Content-Type': 'application/json'}});
    return result;
  }
}
