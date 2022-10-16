import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {PromoPage} from '../../../interfaces/promo-page';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {StorageService} from '../../../services/storage.service';
import {PromoPageService} from '../../../services/promo-page.service';
import {ConfirmDialogComponent} from '../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {ReloadService} from '../../../services/reload.service';

@Component({
  selector: 'app-promo-page',
  templateUrl: './promo-page.component.html',
  styleUrls: ['./promo-page.component.scss']
})
export class PromoPageComponent implements OnInit, OnDestroy {

  dataForm?: FormGroup;


  isLoading = false;
  update = false;
  // Store Data from param
  id?: string;
  promoPage: PromoPage;

  // Image Holder
  placeholder = '/assets/images/avatar/image-upload.jpg';
  pickedImage?: string;

  // // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    public router: Router,
    private promoPageService: PromoPageService,
    private spinner: NgxSpinnerService,
    private storageService: StorageService,
    private dialog: MatDialog,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {

    this.reloadService.refreshPromoPage$.subscribe(() => {
      this.getPromoPage();
    });

    // INIT FORM
    this.initFormGroup();

    this.pickedImage = this.placeholder;

    // Image From state
    if (!this.id) {
      if (this.storageService.getStoredInput('PROMO_PAGE_INPUT')) {
        this.dataForm.patchValue(this.storageService.getStoredInput('PROMO_PAGE_INPUT'));
      }

      if (history.state.images) {
        this.needSessionDestroy = true;
        this.pickedImage = history.state.images[0].url;
        this.dataForm.patchValue(
          {image: this.pickedImage}
        );
      }

    }

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');
      if (this.id) {
        this.getPromoPageByID();
      }
    });

    // GET DATA
    this.getPromoPage();

    this.setFormData();
  }

  /**
   * INIT FORM
   */
  private initFormGroup() {
    this.dataForm = this.fb.group({
      image: [null, Validators.required],
      routerLink: [null, Validators.required],
      promoName: [null],
    });

  }

  // /**
  //  * SET FORM DATA
  //  */
  private setFormData() {
    this.dataForm.patchValue(this.promoPage);

    if (this.storageService.getStoredInput('PROMO_PAGE_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('PROMO_PAGE_INPUT'));
    }
    if (history.state.images) {
      this.needSessionDestroy = true;
      this.pickedImage = history.state.images[0].url;
      this.dataForm.patchValue(
        {image: this.pickedImage}
      );
    } else {
      this.pickedImage = this.promoPage.image ? this.promoPage.image : this.placeholder;
    }
  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'PROMO_PAGE_INPUT');
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.promoPage) {
      const finalData = {...this.dataForm.value, ...{_id: this.promoPage._id}};
      this.editPromoPage(finalData);
    } else {
      this.addPromoPage(this.dataForm.value);
    }

  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private getPromoPageByID() {
    this.spinner.show();
    this.promoPageService.getPromoPageByID(this.id)
      .subscribe(res => {
        this.promoPage = res.data;
        if (this.promoPage) {
          this.setFormData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
      });
  }

  private editPromoPage(data: PromoPage) {
    this.spinner.show();
    this.promoPageService.editPromoPage(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_PAGE_INPUT');
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }


  private addPromoPage(data: any) {
    this.spinner.show();
    this.promoPageService.addPromoPage(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
        this.storageService.removeSessionData('PROMO_PAGE_INPUT');
        this.reloadService.needRefreshPromoPage$();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private getPromoPage() {
    this.spinner.show();
    this.promoPageService.getPromoPage()
      .subscribe(res => {
        this.spinner.hide();
        if (res.data) {
          this.promoPage = res.data;
          this.pickedImage = res.data?.image;
          this.dataForm.patchValue(this.promoPage);
        }
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private updatePromoPageInfo(data: PromoPage) {
    this.spinner.show();
    this.promoPageService.updatePromoPageInfo(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_PAGE_INPUT');
        this.reloadService.needRefreshPromoPage$();
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private deletePromoPage(id: string) {
    this.spinner.show();
    this.promoPageService.deletePromoPage(id)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('PROMO_PAGE_INPUT');
        this.pickedImage = this.placeholder;
        this.promoPage = null;
        this.dataForm.reset();
        this.reloadService.needRefreshPromoPage$();
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * COMPONENT DIALOG VIEW
   */
  public openConfirmDialog(data?: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want delete this Promo Page?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.deletePromoPage(this.promoPage?._id);
      }
    });
  }

  public showupdate(){
    if (this.update) {
      this.update = false;
    } else {
      this.update = true;
    }
  }

  ngOnDestroy() {
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('PROMO_PAGE_INPUT');
    }
  }

}
