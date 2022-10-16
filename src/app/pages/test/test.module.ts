import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestRoutingModule } from './test-routing.module';
import {TestComponent} from './test.component';
import {OverlayModule} from '@angular/cdk/overlay';
import {MaterialModule} from '../../material/material.module';


@NgModule({
  declarations: [
    TestComponent
  ],
  imports: [
    CommonModule,
    TestRoutingModule,
    MaterialModule,
    OverlayModule
  ]
})
export class TestModule { }
