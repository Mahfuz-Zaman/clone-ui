import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareerEsquireRoutingModule } from './career-esquire-routing.module';
import { CareerEsquireComponent } from './career-esquire.component';
import { CareerEsquireDetailsComponent } from './career-esquire-details/career-esquire-details.component';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    CareerEsquireComponent,
    CareerEsquireDetailsComponent
  ],
  imports: [
    CommonModule,
    CareerEsquireRoutingModule,
    PipesModule
  ]
})
export class CareerEsquireModule { }
