import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import {PipesModule} from '../../shared/pipes/pipes.module';


@NgModule({
  declarations: [
    BlogComponent,
    BlogDetailsComponent
  ],
    imports: [
        CommonModule,
        BlogRoutingModule,
        PipesModule
    ]
})
export class BlogModule { }
