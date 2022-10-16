import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminsControlComponent} from './admins-control.component';
import {AddNewAdminComponent} from './add-new-admin/add-new-admin.component';
import {EditAdminComponent} from './edit-admin/edit-admin.component';
import {RouterModule, Routes} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgDynamicBreadcrumbModule} from 'ng-dynamic-breadcrumb';

const routes: Routes = [
  {path: '', component: AdminsControlComponent},
  {path: 'add-new-admin', component: AddNewAdminComponent},
  {path: 'edit-admin/:id', component: EditAdminComponent},
];

@NgModule({
  declarations: [AdminsControlComponent, AddNewAdminComponent, EditAdminComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    FormsModule,
    MatIconModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxSpinnerModule,
    NgDynamicBreadcrumbModule
  ]
})
export class AdminsControlModule {
}
