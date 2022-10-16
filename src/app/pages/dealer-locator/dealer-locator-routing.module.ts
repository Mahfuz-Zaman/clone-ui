import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DealerLocatorComponent} from './dealer-locator.component';

const routes: Routes = [
  {path: '', component: DealerLocatorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerLocatorRoutingModule { }
