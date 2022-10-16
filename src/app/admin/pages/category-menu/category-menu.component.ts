import {Component, OnInit} from '@angular/core';
import {MenuService} from '../../../services/menu.service';
import {CategoryMenu} from '../../../interfaces/category-menu';
import {ReloadService} from '../../../services/reload.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-category-menu',
  templateUrl: './category-menu.component.html',
  styleUrls: ['./category-menu.component.scss']
})
export class CategoryMenuComponent implements OnInit {

  // Category Menu
  categoryMenus: CategoryMenu[] = [];

  constructor(
    private menuService: MenuService,
    private reloadService: ReloadService,
    private dialog: MatDialog,
    private uiService: UiService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshCategoryMenu$
      .subscribe(() => {
        this.getAllCategoryMenu();
      });
    // GET DATA
    this.getAllCategoryMenu();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this category?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteCategoryMenuById(id);
      }
    });
  }


  /**
   * HTTP REQ
   */
  private getAllCategoryMenu() {
    this.spinner.show();
    this.menuService.getAllCategoryMenu()
      .subscribe(res => {
        this.categoryMenus = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private deleteCategoryMenuById(id: string) {
    this.spinner.show();
    this.menuService.deleteCategoryMenuById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshCategoryMenu$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


}
