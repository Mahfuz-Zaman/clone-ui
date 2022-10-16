import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreLocatorRoutingModule } from './store-locator-routing.module';
import { StoreLocatorComponent } from './store-locator.component';
import { DealerSectionOneComponent } from './dealer-section-one/dealer-section-one.component';
import { DealerSectionTwoComponent } from './dealer-section-two/dealer-section-two.component';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    StoreLocatorComponent,
    DealerSectionOneComponent,
    DealerSectionTwoComponent
  ],
    imports: [
        CommonModule,
        StoreLocatorRoutingModule,
        PipesModule
    ]
})
export class StoreLocatorModule { }
