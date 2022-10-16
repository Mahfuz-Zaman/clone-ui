import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {WarrantyDashboardComponent} from './warranty-dashboard.component';
import {AddNewWarrantyComponent} from './add-new-warranty/add-new-warranty.component';


const routes: Routes = [
  {path: '', component: WarrantyDashboardComponent},
  {path: 'add-new-warranty', component: AddNewWarrantyComponent},
  {path: 'edit-warranty/:id', component: AddNewWarrantyComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarrantyDashboardRoutingModule {
}
