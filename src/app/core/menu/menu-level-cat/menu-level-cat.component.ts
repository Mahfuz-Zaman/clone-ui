import {Component, Input, OnInit} from '@angular/core';
import {MenuSide} from '../../../interfaces/menu-side';
import {MenuCtrService} from '../../../services/menu-ctr.service';

@Component({
  selector: 'app-menu-level-cat',
  templateUrl: './menu-level-cat.component.html',
  styleUrls: ['./menu-level-cat.component.scss']
})
export class MenuLevelCatComponent implements OnInit {

  @Input() menuItems: MenuSide[] = [];
  @Input() menuParentId: string;

  parentMenu: MenuSide[] = [];


  constructor(
    private menuCtrService: MenuCtrService
  ) {
  }

  ngOnInit() {
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }


  onClick(menuId: string) {
    this.menuCtrService.toggleMenuItemCategory(menuId);
    this.menuCtrService.closeOtherSubMenusCategory(this.menuItems, menuId);
  }


}
