import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DiscussionRoutingModule } from './discussion-routing.module';
import { DiscussionComponent } from './discussion.component';
import { ReplyDiscussionComponent } from './reply-discussion/reply-discussion.component';
import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../../shared/shared.module';
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [
    DiscussionComponent,
    ReplyDiscussionComponent
  ],
    imports: [
        CommonModule,
        DiscussionRoutingModule,
        MaterialModule,
        MatProgressSpinnerModule,
        ReactiveFormsModule,
        SharedModule,
        NgxPaginationModule
    ]
})
export class DiscussionModule { }
