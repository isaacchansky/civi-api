import { Get, Param, Controller, Req } from '@nestjs/common';
import { ConsolidationService } from './consolidation.service';
import { GoogleCivicService } from './google-civic.service';



@Controller('')
export class AppController {

  constructor(
    private readonly consolidationService: ConsolidationService,
    private readonly googleCivicService: GoogleCivicService) {}

  @Get()
  async root(@Req() request) {
    return `
    <style>
      body { font-family: sans-serif;font-weight:300;color:#333;}
    </style>
      <p><strong>Hi! Welcome to the civi api.</strong></p>
      <p><strong>Endpoints:</strong></p>
      <ul>
        <li><a href="/v1/my-representatives?zip=11211">/v1/my-representatives?zip=11211</a></li>
        <li><a href="/v1/elections">v1/elections</a></li>
        <li><a href="v1/voting?address=101 main street brooklyn ny 11211">v1/voting?address=101 main street brooklyn ny 11211</a></li>
      </ul>
    `;
  }

  @Get('v1/my-representatives')
  async reps(@Req() request) {
    let zip = request.query.zip;
    let data = await this.consolidationService.getRepresentativesByZip(zip);
    return {
      query: request.query,
      data: data
    };
  }

  @Get('v1/elections')
  async elections(@Req() request) {
    let data = await this.googleCivicService.findElections();
    return {
      query: request.query,
      data: data
    };
  }

  @Get('v1/voting')
  async voting(@Req() request) {
    let address = request.query.address;
    let data = await this.googleCivicService.findVoterInfo(address);
    return {
      query: request.query,
      data: data
    };
  }

}
