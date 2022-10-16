import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DealerLocatorRoutingModule } from './dealer-locator-routing.module';
import { DealerLocatorComponent } from './dealer-locator.component';
import { DealerSectionOneComponent } from './dealer-section-one/dealer-section-one.component';
import { DealerSectionTwoComponent } from './dealer-section-two/dealer-section-two.component';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    DealerLocatorComponent,
    DealerSectionOneComponent,
    DealerSectionTwoComponent
  ],
    imports: [
        CommonModule,
        DealerLocatorRoutingModule,
        PipesModule
    ]
})
export class DealerLocatorModule { }
