import { Component, OnInit } from '@angular/core';
import {AboutUs} from '../../../interfaces/about-us';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {AboutUsService} from '../../../services/about-us.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-about-us-pages',
  templateUrl: './about-us-pages.component.html',
  styleUrls: ['./about-us-pages.component.scss']
})
export class AboutUsPagesComponent implements OnInit {

  aboutUsPages: AboutUs[] = [];

  constructor(
    private dialog: MatDialog,
    private aboutUsService: AboutUsService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshAboutUs$
      .subscribe(() => {
        this.getAboutUsPages();
      });
    this.getAboutUsPages();
  }

  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this folder name?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deleteAboutUs(data);
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */
  private getAboutUsPages() {
    this.aboutUsService.getAboutUsPages()
      .subscribe(res => {
        this.aboutUsPages = res.data;
        // console.log(res.data);
      }, err => {
        console.log(err);
      });
  }

  private deleteAboutUs(id: string) {
    this.aboutUsService.deleteAboutUs(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshAboutUs$();
      }, error => {
        console.log(error);
      });
  }
}
