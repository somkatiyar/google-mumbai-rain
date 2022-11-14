import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { SwiperModule } from 'swiper/angular';

import { MapPageRoutingModule } from './map-routing.module';

import { MapPage } from './map.page';
import { MapService } from './map.service';
import { HttpClientModule } from '@angular/common/http';
import { DirectionMapPage } from '../direction-map/direction-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapPageRoutingModule,
    HttpClientModule,
    SwiperModule
  ],
  declarations: [MapPage,DirectionMapPage],
})
export class MapPageModule {}
