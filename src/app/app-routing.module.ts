import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },

    {
    path: '',
    redirectTo: 'rainfall-prediction',
    pathMatch: 'full'
    },
  {
    path: 'folder/:id',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
 
  {
    path: 'rainfall-prediction',
    loadChildren: () => import('./pages/rainfall-prediction/rainfall-prediction.module').then( m => m.RainfallPredictionPageModule)
  },
  {
    path: 'claim-prize',
    loadChildren: () => import('./pages/rainfall-prediction/claim-prize/claim-prize.module').then( m => m.ClaimPrizePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules,useHash:true })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
