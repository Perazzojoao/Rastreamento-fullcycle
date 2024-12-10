import { Module } from '@nestjs/common';
import { PlacesController } from './places/places.controller';
import { PlacesService } from './places/places.service';
import { Client as GoogleMapsClient } from '@googlemaps/google-maps-services-js';
import { DirectionsController } from './directions/directions.controller';
import { DirectionsService } from './directions/directions.service';

@Module({
  imports: [],
  controllers: [PlacesController, DirectionsController],
  providers: [
    {
      provide: GoogleMapsClient,
      useValue: new GoogleMapsClient({}),
    },
    PlacesService,
    DirectionsService,
  ],
  exports: [DirectionsService],
})
export class MapsModule {}
