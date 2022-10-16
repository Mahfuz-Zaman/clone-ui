import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreInfoRoutingModule } from './store-info-routing.module';
import { StoreInfoComponent } from './store-info.component';
import { AddStoreInfoComponent } from './add-store-info/add-store-info.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    StoreInfoComponent,
    AddStoreInfoComponent
  ],
  imports: [
    CommonModule,
    StoreInfoRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule
  ]
})
export class StoreInfoModule { }
