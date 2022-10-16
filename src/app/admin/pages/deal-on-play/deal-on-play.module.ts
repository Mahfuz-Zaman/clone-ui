import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {DealOnPlayRoutingModule} from './deal-on-play-routing.module';
import {DealOnPlayComponent} from './deal-on-play.component';
import {MaterialModule} from '../../../material/material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {AddNewDealOnPlayComponent} from './add-new-deal-on-play/add-new-deal-on-play.component';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS, NgxMatColorPickerModule} from '@angular-material-components/color-picker';
import {DigitOnlyModule} from '@uiowa/digit-only';


@NgModule({
  declarations: [
    DealOnPlayComponent,
    AddNewDealOnPlayComponent
  ],
    imports: [
        CommonModule,
        DealOnPlayRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        FormsModule,
        PipesModule,
        NgxMatColorPickerModule,
        DigitOnlyModule,
    ],
  providers: [
    {provide: MAT_COLOR_FORMATS, useValue: NGX_MAT_COLOR_FORMATS}
  ],
})
export class DealOnPlayModule {
}
