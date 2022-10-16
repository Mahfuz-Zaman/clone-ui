import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';
import {MaterialModule} from "../../material/material.module";
import {MatTableModule} from '@angular/material/table';
import {NgxSpinnerModule} from 'ngx-spinner';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ExtendedModule} from '@angular/flex-layout';


@NgModule({
  declarations: [
    CompareComponent
  ],
    imports: [
        CommonModule,
        CompareRoutingModule,
        MaterialModule,
        MatTableModule,
        NgxSpinnerModule,
        PipesModule,
        ExtendedModule
    ]
})
export class CompareModule { }
