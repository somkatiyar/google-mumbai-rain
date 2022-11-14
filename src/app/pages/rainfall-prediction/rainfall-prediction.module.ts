import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RainfallPredictionPageRoutingModule } from './rainfall-prediction-routing.module';

import { RainfallPredictionPage } from './rainfall-prediction.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RainfallPredictionPageRoutingModule,
    HttpClientModule
  ],
  declarations: [RainfallPredictionPage]
})
export class RainfallPredictionPageModule {}
