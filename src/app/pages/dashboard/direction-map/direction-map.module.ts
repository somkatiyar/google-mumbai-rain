import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DirectionMapPageRoutingModule } from './direction-map-routing.module';

import { DirectionMapPage } from './direction-map.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DirectionMapPageRoutingModule
  ],
  declarations: []
})
export class DirectionMapPageModule {}
