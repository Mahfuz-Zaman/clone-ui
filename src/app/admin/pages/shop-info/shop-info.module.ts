import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShopInfoComponent} from './shop-info.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {ShopInfoRoutingModule} from './shop-info-routing.module';
import {NgxSpinnerModule} from 'ngx-spinner';



@NgModule({
  declarations: [
    ShopInfoComponent
  ],
    imports: [
        CommonModule,
        ShopInfoRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        FormsModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        NgxSpinnerModule,

    ]
})
export class ShopInfoModule { }
