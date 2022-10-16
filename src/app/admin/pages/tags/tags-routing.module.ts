import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TagsComponent} from './tags.component';
import {AddNewTagComponent} from './add-new-tag/add-new-tag.component';

const routes: Routes = [
  {path: '', component: TagsComponent},
  {path: 'add-new-tag', component: AddNewTagComponent},
  // {path: 'edit-tag/:id', component: AddNewTagComponent},
  {path: 'edit-tag/:slug', component: AddNewTagComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TagsRoutingModule {
}
