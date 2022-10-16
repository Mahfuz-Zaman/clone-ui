import { SwiperModule } from 'swiper/angular';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ProductDetailsRoutingModule} from './product-details-routing.module';
import {ProductDetailsComponent} from './product-details.component';
import {MaterialModule} from '../../material/material.module';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ProductCardTwoModule} from '../../shared/lazy-component/product-card-two/product-card-two.module';
import {StarRatingModule} from '../../shared/lazy-component/star-rating/star-rating.module';
import {RatingAndReviewComponent} from './rating-and-review/rating-and-review.component';
import {ProductCardOneModule} from '../../shared/lazy-component/product-card-one/product-card-one.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {BreadcrumbModule} from '../../shared/lazy-component/breadcrumb/breadcrumb.module';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';
import { DiscussionFormComponent } from './discussion/discussion-form/discussion-form.component';
import { DiscussionItemComponent } from './discussion/discussion-item/discussion-item.component';
import { DiscussionReplyItemComponent } from './discussion/discussion-reply-item/discussion-reply-item.component';
import { CalculateCoolingCapacityModule } from 'src/app/shared/dialog-view/calculate-cooling-capacity/calculate-cooling-capacity.module';

@NgModule({
  declarations: [ProductDetailsComponent, RatingAndReviewComponent, DiscussionFormComponent, DiscussionItemComponent, DiscussionReplyItemComponent],
    imports: [
        CommonModule,
        ProductDetailsRoutingModule,
        MaterialModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ProductCardTwoModule,
        StarRatingModule,
        ProductCardOneModule,
        PipesModule,
        BreadcrumbModule,
        ShareButtonsModule,
        ShareIconsModule,
        SwiperModule,
        CalculateCoolingCapacityModule
    ]
})
export class ProductDetailsModule {
}
