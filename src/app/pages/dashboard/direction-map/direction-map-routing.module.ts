import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DirectionMapPage } from './direction-map.page';

const routes: Routes = [
  {
    path: '',
    component: DirectionMapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DirectionMapPageRoutingModule {}
