import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';

@Module({
  imports: [HttpModule],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
