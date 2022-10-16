import { SwiperModule } from 'swiper/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardOneComponent} from './product-card-one.component';
import {RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {QuickViewDialogComponent} from './quick-view-dialog/quick-view-dialog.component';
import {PipesModule} from '../../pipes/pipes.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {ProductRatingViewModule} from '../product-rating-view/product-rating-view.module';
import {LazyLoadImageModule} from 'ng-lazyload-image';


@NgModule({
  declarations: [
    ProductCardOneComponent,
    QuickViewDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    PipesModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    ProductRatingViewModule,
    LazyLoadImageModule,
    SwiperModule
  ],
  // providers: [{provide: LAZYLOAD_IMAGE_HOOKS, useClass: ScrollHooks}],
  exports: [
    ProductCardOneComponent
  ],
})
export class ProductCardOneModule {
}
