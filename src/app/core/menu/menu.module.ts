import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MenuComponent} from './menu.component';
import {HeaderComponent} from './header/header.component';
import {SidenavListComponent} from './sidenav-list/sidenav-list.component';
import {SharedModule} from '../../shared/shared.module';
import {RouterModule} from '@angular/router';
import {LangTranslateModule} from '../lang-translate/lang-translate.module';
import {MaterialModule} from '../../material/material.module';
import {FormsModule} from '@angular/forms';
import {MegaMenuComponent} from './mega-menu/mega-menu.component';
import {MenuLevelCatComponent} from './menu-level-cat/menu-level-cat.component';
import {HomeModule} from '../../pages/home/home.module';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {MenuHoverContentComponent} from './mega-menu/menu-hover-content/menu-hover-content.component';


@NgModule({
  declarations: [
    MenuComponent,
    HeaderComponent,
    SidenavListComponent,
    MegaMenuComponent,
    MenuLevelCatComponent,
    MenuHoverContentComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    LangTranslateModule,
    MaterialModule,
    FormsModule,
    HomeModule,
    PipesModule
  ],
  exports: [
    MenuComponent
  ]
})
export class MenuModule {
}
