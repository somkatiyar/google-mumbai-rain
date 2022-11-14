import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SwiperModule } from 'swiper/angular';
import { IonicModule } from '@ionic/angular';
import { UserDashboardPageRoutingModule } from './user-dashboard-routing.module';
import { UserDashboardPage } from './user-dashboard.page';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UserDashboardPageRoutingModule,
    SwiperModule,ShareButtonsModule.withConfig({
      debug:true
    }),
    ShareIconsModule
  ],
  declarations: [UserDashboardPage]
})
export class UserDashboardPageModule {}
