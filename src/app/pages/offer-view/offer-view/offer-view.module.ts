import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OfferViewRoutingModule } from './offer-view-routing.module';
import { OfferViewComponent } from './offer-view.component';
import {DealOfDayCardModule} from '../../shared/lazy-component/deal-of-day-card/deal-of-day-card.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    OfferViewComponent
  ],
    imports: [
        CommonModule,
        OfferViewRoutingModule,
        DealOfDayCardModule,
        ProductCardOneModule,
        PipesModule
    ]
})
export class OfferViewModule { }
