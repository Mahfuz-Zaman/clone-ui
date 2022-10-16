import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NewsletterRoutingModule } from './newsletter-routing.module';
import { NewsletterComponent } from './newsletter.component';
import {MaterialModule} from '../../../material/material.module';
import {FlexModule} from '@angular/flex-layout';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgxSpinnerModule} from 'ngx-spinner';


@NgModule({
  declarations: [
    NewsletterComponent
  ],
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    MaterialModule,
    FlexModule,
    NgxPaginationModule,
    NgxSpinnerModule
  ]
})
export class NewsletterModule { }
