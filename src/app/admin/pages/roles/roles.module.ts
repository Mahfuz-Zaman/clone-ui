import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RolesComponent} from './roles.component';
import {RolesRoutingModule} from './roles-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AddRoleComponent} from './add-role/add-role.component';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    RolesComponent,
    AddRoleComponent
  ],
    imports: [
        CommonModule,
        RolesRoutingModule,
        ReactiveFormsModule,
        MaterialModule,
        FlexLayoutModule,
        NgxSpinnerModule
    ]
})
export class RolesModule {
}
