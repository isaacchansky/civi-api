import { Component } from '@nestjs/common';
import { GoogleCivicService } from './google-civic.service';
import { CivilServicesService } from './civil-services.service';

@Component()
export class ConsolidationService {
  constructor(private readonly googleCivicService: GoogleCivicService, private readonly civilServicesService: CivilServicesService) {}

  async getRepresentativesByZip(zip: string) {
    let googleData = await this.googleCivicService.findRepresentativesByZip(zip);
    let civilData = await this.civilServicesService.findRepresentativesByZip(zip);

    let formattedAddress = googleData['normalizedInput'];
    let officials = googleData['officials'];
    let offices = googleData['offices'];
    let divisions = googleData['divisions'];

    let senateMembers = civilData['data'].senate;
    let houseMembers = civilData['data'].house;

    // Expand google dataset
    officials = officials.map( (official, officialIndex) => {
      // Find official in civil data.
      // website seems to be the best, consistent 'primary key' so to speak.
      let primaryURL = official.urls[0];
      let additionalOfficialData = null;
      senateMembers.forEach(m => {
        // strip out trailing slash because that can be an issue w/ matching
        if (m.website.replace(/\/$/, "") === primaryURL.replace(/\/$/, "")) {
          additionalOfficialData = m;
        }
      });
      houseMembers.forEach(h => {
        if (h.website === primaryURL) {
          additionalOfficialData = m;
        }
      });

      official.channels = official.channels.map(c => {
        return {
          type: c.type,
          url: `https://${c.type}.com/${c.id}`
        };
      });

      // office & divisions
      offices.forEach(office => {
        if (office.officialIndices.indexOf(officialIndex) > -1) {
          official.office = {
            name: office.name,
            roles: office.roles,
            levels: office.levels,
            division: divisions[office.divisionId].name
          }
        }
      });

      if (additionalOfficialData) {
        official.bio = {
          age: additionalOfficialData.age,
          desription: additionalOfficialData.biography,
          ethnicity: additionalOfficialData.ethnicity,
          gender: additionalOfficialData.gender,
          religion: additionalOfficialData.religion
        };

        official.dates = {
          enteredOffice: additionalOfficialData.entered_office,
          termEnd: additionalOfficialData.term_end,
          dateOfBirth: additionalOfficialData.date_of_birth
        };


        official.channels.push({
          type: 'web',
          url: additionalOfficialData.contact_page
        });

        official.resourceURLs = {
          bioGuide: additionalOfficialData.bioguide_url,
          civilServices: additionalOfficialData.civil_services_url,
          govTrack: additionalOfficialData.govtrack_url,
          openSecrets: additionalOfficialData.opensecrets_url,
          voteSmart: additionalOfficialData.votesmart_url
        };
      }


      return official;
    });

    return {
      formattedAddress,
      officials
    };
  }

}
