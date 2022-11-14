import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomeScreenPageRoutingModule } from './home-screen-routing.module';

import { HomeScreenPage } from './home-screen.page';
import { NgxPaginationModule } from 'ngx-pagination';
import { LoaderInterceptorService } from 'src/app/services/loader/loader-interceptor.service';
import { BlockUIModule } from 'ng-block-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomeScreenPageRoutingModule,
    NgxPaginationModule,
  ],
  declarations: [HomeScreenPage],
  providers:[
  ]
})
export class HomeScreenPageModule {}
