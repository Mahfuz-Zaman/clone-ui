import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ReloadService} from '../../../services/reload.service';
import {UiService} from '../../../services/ui.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {ImageFolder} from '../../../interfaces/image-folder';
import {ImageFolderService} from '../../../services/image-folder.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-folder.component.html',
  styleUrls: ['./image-folder.component.scss']
})
export class ImageFolderComponent implements OnInit {

  folders: ImageFolder[] = [];

  constructor(
    private dialog: MatDialog,
    private imageFolderService: ImageFolderService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) {
  }

  ngOnInit(): void {
    this.reloadService.refreshImageFolder$
      .subscribe(() => {
        this.getAllImageFolderList();
      });
    this.getAllImageFolderList();
  }

  /**
   * COMPONENT DIALOG VIEW
   */
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
        this.deleteImageFolderData(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllImageFolderList() {
    this.imageFolderService.getAllImageFolderList()
      .subscribe(res => {
        this.folders = res.data;
      }, err => {
        console.log(err);
      });
  }

  private deleteImageFolderData(id: string) {
    this.imageFolderService.deleteImageFolderData(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshImageFolder$();
      }, error => {
        console.log(error);
      });
  }


}
