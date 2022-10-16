import { SwiperModule } from 'swiper/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealOfDayCardComponent } from './deal-of-day-card.component';
import {RouterModule} from '@angular/router';
import {TimeCounterOneModule} from '../time-counter-one/time-counter-one.module';
import {PipesModule} from '../../pipes/pipes.module';
import {ExtendedModule} from '@angular/flex-layout';



@NgModule({
  declarations: [
    DealOfDayCardComponent
  ],
    imports: [
        CommonModule,
        RouterModule,
        TimeCounterOneModule,
        PipesModule,
        ExtendedModule,
        SwiperModule
    ],
  exports: [
    DealOfDayCardComponent
  ]
})
export class DealOfDayCardModule { }
