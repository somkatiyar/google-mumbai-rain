import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClaimPrizePageRoutingModule } from './claim-prize-routing.module';

import { ClaimPrizePage } from './claim-prize.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClaimPrizePageRoutingModule
  ],
  declarations: [ClaimPrizePage]
})
export class ClaimPrizePageModule {}
