import {Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {environment} from '../../../../../environments/environment';
import {Subscription} from 'rxjs';
import {FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {FileUploadService} from '../../../../services/file-upload.service';
import {UiService} from '../../../../services/ui.service';
import {MatDialog} from '@angular/material/dialog';
import {NgxSpinnerService} from 'ngx-spinner';
import {DataService} from '../../../../services/data.service';
import {NgDynamicBreadcrumbService} from 'ng-dynamic-breadcrumb';
import {FileData} from '../../../../interfaces/file-data';
import {Admin} from '../../../../interfaces/admin';
import {UtilsService} from '../../../../services/utils.service';
import {isPlatformBrowser} from '@angular/common';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-add-new-admin',
  templateUrl: './add-new-admin.component.html',
  styleUrls: ['./add-new-admin.component.scss']
})
export class AddNewAdminComponent implements OnInit {

  readonly baseAdminUrl = environment.adminBaseUrl;

  private sup: Subscription;
  private sub: any;

  public form: FormGroup;
  private finalFormData: Admin = null;


  // Image Upload
  @ViewChild('imagePicker1') imagePicker1: ElementRef;
  pickedImageCard = null;
  fileImgCard: any = null;

  // Form Data
  dataForm: FormGroup;

  autoSlug = true;

  name = new FormControl(null, {validators: [Validators.required]});
  username = new FormControl(null, {validators: [Validators.required]});
  email = new FormControl(null, {validators: [Validators.email]});
  phoneNo = new FormControl(null, {validators: [Validators.required]});
  role = new FormControl(null, {validators: [Validators.required]});
  hasAccess = new FormControl(null, {validators: [Validators.required]});
  password = new FormControl(null, {validators: [Validators.required]});
  confirmPassword = new FormControl(null, {validators: [Validators.required]});

  // Reset
  @ViewChild('formDirective') formDirective: NgForm;

  rolesList: any[] = [
    {value: 'admin', viewValue: 'Admin'},
    {value: 'editor', viewValue: 'Editor'}
  ];

  booleanList: any[] = [
    {value: true, viewValue: 'Yes'},
    {value: false, viewValue: 'No'}
  ];


  constructor(
    public fileUploadService: FileUploadService,
    private uiService: UiService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private ngDynamicBreadcrumbService: NgDynamicBreadcrumbService,
    private utilsService: UtilsService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
  }

  ngOnInit(): void {

    this.dataForm = new FormGroup({
      name: this.name,
      username: this.username,
      email: this.email,
      phoneNo: this.phoneNo,
      role: this.role,
      hasAccess: this.hasAccess,
      password: this.password,
      confirmPassword: this.confirmPassword,
    });

    this.autoGenerateSlug();

    this.updateBreadcrumb();

  }


  /**
   * ON FORM SUBMIT ACTION
   */

  public onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all required field');
      return;
    }

    if (this.dataForm.value.password !== this.dataForm.value.confirmPassword) {
      this.uiService.warn('Password and confirm password not matched');
      return;
    }

    const date = this.utilsService.getDateWithCurrentTime(new Date());
    const finalUsername = {username: this.checkSlug(this.dataForm.value.username)};
    this.finalFormData = {...this.dataForm.value, ...finalUsername, ...{registrationAt: date}};

    if (this.pickedImageCard === null) {
      this.uiService.wrong('No Image Provided! Upload all the required images');
      return;
    } else {
      this.openConfirmDialog();
    }
  }


  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Save new Admin',
        message: 'Are you sure you want continue to save?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.addDataWithImage();
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */


  private adminSignUp() {
    this.dataService.adminSignUp(this.finalFormData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.resetForm();
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  /**
   * RESET FORM
   */

  private resetForm() {
    this.formDirective.resetForm();
    this.finalFormData = null;
    this.removePickedCardImage();
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
    }
  }


  /**
   * IMAGE PICKER
   * PDF FILE PICKER
   */

  fileChangeEventCardImg(event: any) {
    this.fileImgCard = (event.target as HTMLInputElement).files[0];

    const reader = new FileReader();
    reader.readAsDataURL(this.fileImgCard);

    reader.onload = () => {
      this.pickedImageCard = reader.result as string;
    };
  }


  removePickedCardImage() {
    this.imagePicker1.nativeElement.value = null;
    this.fileImgCard = null;
    this.pickedImageCard = null;
  }


  /**
   * IMAGE UPLOAD HTTP REQ HANDLE
   * PDF UPLOAD
   */

  addDataWithImage() {

    this.spinner.show();

    const dataCardImg: FileData = {
      fileName: this.dataForm.value.username + this.getRandomInt(100, 5000) + '.' + this.fileImgCard.name.split('.').pop(),
      file: this.fileImgCard,
      folderPath: 'admins'
    };

    this.fileUploadService.uploadSingleImage(dataCardImg)
      .subscribe(resImg => {
        const imageData = {
          profileImg: resImg.downloadUrl
        };
        this.finalFormData = {...this.finalFormData, ...imageData};
        this.adminSignUp();
      });

  }


  /**
   * LOGICAL PART
   */
  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sup = this.dataForm.get('name').valueChanges
        .pipe(
        ).subscribe(d => {
          // var fixed  = string.replace(/,|\.|-/g, '');
          const res = d?.trim().replace(/,|\s+/g, '-').toLowerCase();
          this.dataForm.patchValue({
            username: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sup.unsubscribe();
    }
  }


  /**
   * CHECK SLUG
   */

  private checkSlug(slug: string): string {
    return slug.toLowerCase().replace(/\s|_|#|[\(\)]|,/g, '-');
  }

  private getRandomInt(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * BREADCRUMB
   */

  updateBreadcrumb(): void {

    const breadcrumbs = [
      {
        label: 'Dashboard',
        url: `/${this.baseAdminUrl}/dashboard`
      },
      {
        label: 'Admin Control',
        url: `/${this.baseAdminUrl}/admins-control`
      },
      {
        label: 'Add New Admin',
        url: ''
      }
    ];
    this.ngDynamicBreadcrumbService.updateBreadcrumb(breadcrumbs);
  }
}
