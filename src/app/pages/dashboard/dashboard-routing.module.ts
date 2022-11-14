import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPage } from './dashboard.page';

const routes: Routes = [

  {
    path: 'add-location',
    loadChildren: () => import('./add-location/add-location.module').then( m => m.AddLocationPageModule)
  },
  {
    path: 'home-screen/:id',
    loadChildren: () => import('./home-screen/home-screen.module').then( m => m.HomeScreenPageModule)
  },
  {
    path: 'home-screen',
    loadChildren: () => import('./home-screen/home-screen.module').then( m => m.HomeScreenPageModule)
  },
  {
    path: 'setting',
    loadChildren: () => import('./setting/setting.module').then( m => m.SettingPageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then( m => m.NewsPageModule)
  },
  {
    path: 'news-detail',
    loadChildren: () => import('./news-detail/news-detail.module').then( m => m.NewsDetailPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./map/map.module').then( m => m.MapPageModule)
  },

  {
    path:'',
    redirectTo:'map',
    pathMatch:'full'
  },
  {
    path: 'direction-map',
    loadChildren: () => import('./direction-map/direction-map.module').then( m => m.DirectionMapPageModule)
  }



];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardPageRoutingModule {}
