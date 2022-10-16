import { MatIconModule } from '@angular/material/icon';
import { SwiperModule } from 'swiper/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {HomeComponent} from './home.component';
import {SharedModule} from '../../shared/shared.module';
import {MaterialModule} from '../../material/material.module';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {ProductCardFoodModule} from '../../shared/lazy-component/product-card-food/product-card-food.module';
import {BrandCardOneModule} from '../../shared/lazy-component/brand-card-one/brand-card-one.module';
import {ShopCardOneModule} from '../../shared/lazy-component/shop-card-one/shop-card-one.module';
import {CategoryCardModule} from '../../shared/lazy-component/category-card/category-card.module';
import {DealOfDayCardModule} from '../../shared/lazy-component/deal-of-day-card/deal-of-day-card.module';
import {OfferCardModule} from '../../shared/lazy-component/offer-card/offer-card.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {ProductServicesModule} from 'src/app/shared/components/product-services/product-services.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    MaterialModule,
    ProductCardOneModule,
    ProductCardTwoModule,
    ProductCardFoodModule,
    BrandCardOneModule,
    ShopCardOneModule,
    CategoryCardModule,
    DealOfDayCardModule,
    OfferCardModule,
    PipesModule,
    ProductServicesModule,
    LazyLoadImageModule,
    SwiperModule,
    MatIconModule
  ],
})
export class HomeModule {
}
