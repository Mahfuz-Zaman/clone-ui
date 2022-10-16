import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BannerRoutingModule } from './banner-routing.module';
import { BannerComponent } from './banner.component';
import { AddNewBannerComponent } from './add-new-banner/add-new-banner.component';
import {MaterialModule} from '../../../material/material.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {DigitOnlyModule} from '@uiowa/digit-only';


@NgModule({
  declarations: [
    BannerComponent,
    AddNewBannerComponent
  ],
    imports: [
        CommonModule,
        BannerRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexModule,
        PipesModule,
        DigitOnlyModule
    ]
})
export class BannerModule { }
