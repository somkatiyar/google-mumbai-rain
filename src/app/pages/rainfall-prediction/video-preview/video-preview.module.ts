import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoPreviewPageRoutingModule } from './video-preview-routing.module';

import { VideoPreviewPage } from './video-preview.page';
import { VideoService } from '../video.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoPreviewPageRoutingModule,
    
  ],
  providers:[VideoService],
  declarations: [VideoPreviewPage]
})
export class VideoPreviewPageModule {}
