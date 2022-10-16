import {Component, Input, OnInit} from '@angular/core';
import {MenuSide} from '../../../interfaces/menu-side';
import {MenuCtrService} from '../../../services/menu-ctr.service';


@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.scss']
})
export class SidenavListComponent implements OnInit {

  @Input() menuItems: MenuSide[] = [];
  @Input() menuParentId: string;

  parentMenu: MenuSide[] = [];


  constructor(
    private menuCtrService: MenuCtrService
  ) {
  }

  ngOnInit() {
    // console.log('Iam Here');
    this.parentMenu = this.menuItems.filter(item => item.parentId === this.menuParentId);
  }


  onClick(menuId: string) {
    this.menuCtrService.toggleMenuItem(menuId);
    this.menuCtrService.closeOtherSubMenus(this.menuItems, menuId);
  }


}
