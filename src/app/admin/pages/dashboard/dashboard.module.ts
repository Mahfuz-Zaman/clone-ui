import { orders } from './../../../core/utils/dashboard.data';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DashboardComponent} from './dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {MaterialModule} from '../../../material/material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {BarChartModule, LineChartModule} from '@swimlane/ngx-charts';
import {TilesComponent} from './tiles/tiles.component';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import {InfoCardsComponent} from './info-cards/info-cards.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipesModule} from '../../../shared/pipes/pipes.module';
import {SharedModule} from '../../../shared/shared.module';
import {OrderDetailsComponent} from './order-details/order-details.component';
import { MatCardModule } from '@angular/material/card';


const routes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'order-details/:id', component: OrderDetailsComponent},
];


@NgModule({
  declarations: [
    DashboardComponent,
    TilesComponent,
    InfoCardsComponent,
    OrderDetailsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule,
    FlexLayoutServerModule,
    LineChartModule,
    BarChartModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PipesModule,
    MatCardModule
  ]
})
export class DashboardModule {
}
