import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GoogleCivicService } from './google-civic.service';
import { CivilServicesService } from './civil-services.service';
import { ConsolidationService } from './consolidation.service';

@Module({
  imports: [],
  controllers: [AppController],
  components: [GoogleCivicService, CivilServicesService, ConsolidationService],
})
export class ApplicationModule {}
