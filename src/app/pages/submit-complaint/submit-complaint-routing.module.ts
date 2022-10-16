import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SubmitComplaintComponent} from './submit-complaint.component';

const routes: Routes = [
  {
    path: '',
    component: SubmitComplaintComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubmitComplaintRoutingModule {
}
