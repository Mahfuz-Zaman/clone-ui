import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselsRoutingModule } from './carousels-routing.module';
import { CarouselsComponent } from './carousels.component';
import { AddCarouselComponent } from './add-carousel/add-carousel.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    CarouselsComponent,
    AddCarouselComponent
  ],
  imports: [
    CommonModule,
    CarouselsRoutingModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    PipesModule,
    NgxSpinnerModule
  ]
})
export class CarouselsModule { }
