import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {environment} from '../../../../../environments/environment';
import {Product} from '../../../../interfaces/product';
import {OfferProduct} from '../../../../interfaces/offer-product';
import {InstallationRepair} from '../../../../interfaces/installation-repair';
import {InstallationRepairService} from '../../../../services/installation-repair.service';
import {PromotionalOffer} from '../../../../interfaces/promotional-offer';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {StorageService} from '../../../../services/storage.service';
import {MatDialog} from '@angular/material/dialog';
import {ProductService} from '../../../../services/product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {CategoryService} from '../../../../services/category.service';
import {PromotionalOfferService} from '../../../../services/promotional-offer.service';
import {ProductTableComponent} from '../../components/product-table/product-table.component';
import {MatSelectChange} from '@angular/material/select';
import {InstallationRepairType} from '../../../../interfaces/installation-repair-type';
import {InstallationRepairTypeService} from '../../../../services/installation-repair-type.service';

@Component({
  selector: 'app-add-installation-repair',
  templateUrl: './add-installation-repair.component.html',
  styleUrls: ['./add-installation-repair.component.scss']
})
export class AddInstallationRepairComponent implements OnInit {

  // Form Template Ref
  @ViewChild('templateForm') templateForm: NgForm;

  // Subscriptions
  private subProduct: Subscription;

  // Admin Base Url
  readonly adminBaseUrl = environment.adminBaseUrl;

  dataForm: FormGroup;
  private sub: Subscription;
  installationRepairTypes: InstallationRepairType[] = [];


  // Store Data from param
  id?: string;
  products: Product[] = [];
  installationsRepair: InstallationRepair = null;

  // From Dialog
  selectedProductIds: string[] = [];

  // Destroy Session
  needSessionDestroy = true;
  installationRepairTypeSlug: string = null;

  constructor(
    private fb: FormBuilder,
    private installationRepairService: InstallationRepairService,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private storageService: StorageService,
    public router: Router,
    private dialog: MatDialog,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private categoryService: CategoryService,
    private installationRepairTypeService: InstallationRepairTypeService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      installationRepairType: [null, Validators.required],
      installationRepairTypeSlug: [null],
      products: [null, Validators.required]
    });

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getSingleOfferProductById();
      }
    });

    this.getAllInstallationRepairType();
  }

  /**
   * SET FORM DATA
   */
  private setFormData() {
    this.dataForm.patchValue(this.installationsRepair);

    if (this.storageService.getStoredInput('INSTALLATION_REPAIR_INPUT')) {
      this.dataForm.patchValue(this.storageService.getStoredInput('INSTALLATION_REPAIR_INPUT'));
    }
  }

  /**
   * OPEN COMPONENT DIALOG
   */

  public openComponentDialog(data?: any) {
    const dialogRef = this.dialog.open(ProductTableComponent, {
      data: this.installationsRepair ? this.products.map(m => m._id) : null,
      panelClass: ['theme-dialog', 'full-screen-modal'],
      width: '100%',
      minHeight: '60%',
      autoFocus: false,
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (dialogResult.selectedIds) {
          this.selectedProductIds = dialogResult.selectedIds;
          this.dataForm.patchValue({products: dialogResult.selectedIds});
          this.getSpecificProductsById(this.selectedProductIds);
        }
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const finalData = {...this.dataForm.value, ...{_id: this.id}};
      this.editInstallationRepair(finalData);
    } else {
      this.addNewInstallationRepair({...this.dataForm.value, ...{installationRepairTypeSlug: this.installationRepairTypeSlug}});
    }

  }

  /**
   * ON HOLD INPUT DATA
   */

  onHoldInputData() {
    this.needSessionDestroy = false;
    this.storageService.storeInputData(this.dataForm?.value, 'INSTALLATION_REPAIR_INPUT');
  }

  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private getAllInstallationRepairType() {
    this.installationRepairTypeService.getAllInstallationRepairType()
      .subscribe(res => {
        this.installationRepairTypes = res.data;
        // console.log(res.data);
      }, error => {
        console.log(error);
      });
  }

  private addNewInstallationRepair(data: InstallationRepair) {
    this.installationRepairService.addNewInstallationRepair(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.templateForm.resetForm();
        this.storageService.removeSessionData('INSTALLATION_REPAIR_INPUT');
        this.selectedProductIds = [];
        this.products = [];
      }, err => {
        console.log(err);
      });
  }

  private getSingleOfferProductById() {
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.installationRepairService.getSingleInstallationRepairById(this.id, selectProductField)
      .subscribe(res => {
        this.installationsRepair = res.data;
        this.products = this.installationsRepair.products as Product[];
        this.setFormData();
      }, error => {
        console.log(error);
      });
  }

  private editInstallationRepair(data: InstallationRepair) {
    this.installationRepairService.editInstallationRepair(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.storageService.removeSessionData('INSTALLATION_REPAIR_INPUT');
      }, err => {
        console.log(err);
      });
  }

  private getSpecificProductsById(ids: string[]) {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subProduct = this.productService.getSpecificProductsById(ids, selectProductField)
      .subscribe(res => {
        this.products = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }


  onInstallationRepairTypeSelect(event: MatSelectChange) {
    console.log(event.value);
    if (event.value) {
      const slug = this.installationRepairTypes.find(f => f._id === event.value).slug;
      this.dataForm.patchValue(
        {routerLink: slug}
      );
      this.installationRepairTypeSlug = slug;
      // console.log(this.installationRepairTypeSlug);
      // console.log(slug);
    }
  }

  // tslint:disable-next-line:use-lifecycle-interface
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.subProduct) {
      this.subProduct.unsubscribe();
    }
    if (this.needSessionDestroy) {
      this.storageService.removeSessionData('INSTALLATION_REPAIR_INPUT');
    }
  }

}
