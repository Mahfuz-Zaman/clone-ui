import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SellOnRoutingModule } from './sell-on-routing.module';
import { SellOnComponent } from './sell-on.component';
import {CarouselModule} from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [
    SellOnComponent
  ],
    imports: [
        CommonModule,
        SellOnRoutingModule,
        CarouselModule
    ]
})
export class SellOnModule { }
