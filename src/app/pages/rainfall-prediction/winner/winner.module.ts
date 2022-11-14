import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WinnerPageRoutingModule } from './winner-routing.module';

import { WinnerPage } from './winner.page';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WinnerPageRoutingModule,
    ShareButtonsModule.withConfig({
      debug:true
    }),
    ShareIconsModule
  ],
  declarations: [WinnerPage]
})
export class WinnerPageModule {}
