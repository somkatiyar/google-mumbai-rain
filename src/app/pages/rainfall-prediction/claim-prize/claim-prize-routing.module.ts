import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClaimPrizePage } from './claim-prize.page';

const routes: Routes = [
  {
    path: '',
    component: ClaimPrizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClaimPrizePageRoutingModule {}
