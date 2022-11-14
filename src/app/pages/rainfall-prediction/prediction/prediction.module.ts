import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PredictionPageRoutingModule } from './prediction-routing.module';

import { PredictionPage } from './prediction.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PredictionPageRoutingModule
  ],
  declarations: [PredictionPage]
})
export class PredictionPageModule {}
