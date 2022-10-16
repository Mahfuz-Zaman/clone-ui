import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AddCarouselComponent} from './add-carousel/add-carousel.component';
import {CarouselsComponent} from './carousels.component';

const routes: Routes = [
  {path: '', component: CarouselsComponent},
  {path: 'add-new-carousel', component: AddCarouselComponent},
  {path: 'edit-carousel/:id', component: AddCarouselComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CarouselsRoutingModule { }
