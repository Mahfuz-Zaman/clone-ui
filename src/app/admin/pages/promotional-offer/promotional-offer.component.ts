import { Component, OnInit } from '@angular/core';
import {PromotionalOffer} from '../../../interfaces/promotional-offer';
import {MatDialog} from '@angular/material/dialog';
import {UiService} from '../../../services/ui.service';
import {ReloadService} from '../../../services/reload.service';
import {PromotionalOfferService} from '../../../services/promotional-offer.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-promotional-offer',
  templateUrl: './promotional-offer.component.html',
  styleUrls: ['./promotional-offer.component.scss']
})
export class PromotionalOfferComponent implements OnInit {

  allPromotionalOffer: PromotionalOffer[] = [];

  constructor(
    private dialog: MatDialog,
    private promotionalOfferService: PromotionalOfferService,
    private uiService: UiService,
    private reloadService: ReloadService
  ) { }

  ngOnInit(): void {
    this.reloadService.refreshPromotionalOffer$
      .subscribe(() => {
        this.getAllPromotionalOffer();
      });
    this.getAllPromotionalOffer();
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
        this.deletePromotionalOfferById(data);
      }
    });
  }

  /**
   * HTTP REQ HANDLE
   */
  private getAllPromotionalOffer() {
    this.promotionalOfferService.getAllPromotionalOffer()
      .subscribe(res => {
        this.allPromotionalOffer = res.data;
        // console.log(res.data);
      }, err => {
        console.log(err);
      });
  }

  private deletePromotionalOfferById(id: string) {
    this.promotionalOfferService.deletePromotionalOfferById(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshPromotionalOffer$();
      }, error => {
        console.log(error);
      });
  }

}
