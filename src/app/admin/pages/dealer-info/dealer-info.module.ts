import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerInfoRoutingModule } from './dealer-info-routing.module';
import { DealerInfoComponent } from './dealer-info.component';
import { AddDealerInfoComponent } from './add-dealer-info/add-dealer-info.component';
import {MaterialModule} from '../../../material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    DealerInfoComponent,
    AddDealerInfoComponent
  ],
  imports: [
    CommonModule,
    DealerInfoRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class DealerInfoModule { }
