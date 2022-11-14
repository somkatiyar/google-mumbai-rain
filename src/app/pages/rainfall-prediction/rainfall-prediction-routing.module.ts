import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RainfallPredictionPage } from './rainfall-prediction.page';

const routes: Routes = [
  {
    path: '',
    component: RainfallPredictionPage
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  
  {
    path: 'user-dashboard',
    loadChildren: () => import('./user-dashboard/user-dashboard.module').then( m => m.UserDashboardPageModule)
  },
  {
    path: 'prediction',
    loadChildren: () => import('./prediction/prediction.module').then( m => m.PredictionPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'notification',
    loadChildren: () => import('./notification/notification.module').then( m => m.NotificationPageModule)
  },
  {
    path: 'winner',
    loadChildren: () => import('./winner/winner.module').then( m => m.WinnerPageModule)
  },
  {
    path: 'claim-prize',
    loadChildren: () => import('./claim-prize/claim-prize.module').then( m => m.ClaimPrizePageModule)
  },
  {
    path: 'video-preview',
    loadChildren: () => import('./video-preview/video-preview.module').then( m => m.VideoPreviewPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RainfallPredictionPageRoutingModule {}
