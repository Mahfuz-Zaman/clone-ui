import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {UiService} from '../../../../services/ui.service';
import {ImageFolderService} from '../../../../services/image-folder.service';
import {ImageFolder} from '../../../../interfaces/image-folder';


@Component({
  selector: 'app-upload-image',
  templateUrl: './add-image-folder.component.html',
  styleUrls: ['./add-image-folder.component.scss']
})
export class AddImageFolderComponent implements OnInit {

  dataForm?: FormGroup;
  private sub: Subscription;

  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private imageFolderService: ImageFolderService
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      name: [null, Validators.required],
      slug: [null, Validators.required]
    });

    this.autoGenerateSlug();

    // GET ID FORM PARAM
    this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getAttributeByAttributeId();
      }
    });
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.id) {
      const mData = {...this.dataForm.value, ...{_id: this.id}};
      this.editImageFolderData(mData);
    } else {
      this.addNewImageFolderData(this.dataForm.value);
    }

  }

  autoGenerateSlug() {
    if (this.autoSlug === true) {
      this.sub = this.dataForm.get('name').valueChanges
        .pipe(
          // debounceTime(200),
          // distinctUntilChanged()
        ).subscribe(d => {
          const res = d.trim().replace(/[^A-Z0-9]+/ig, '-').toLowerCase();
          this.dataForm.patchValue({
            slug: res
          });
        });
    } else {
      if (this.sub === null || this.sub === undefined) {
        return;
      }
      this.sub.unsubscribe();
    }
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private addNewImageFolderData(data: ImageFolder) {
    this.imageFolderService.addNewImageFolderData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.dataForm.updateValueAndValidity();
        this.dataForm.reset(this.dataForm.value);
      }, error => {
        console.log(error);
      });
  }

  private getAttributeByAttributeId() {
    this.imageFolderService.getSingleImageFolderById(this.id)
      .subscribe(res => {
        if (res.data) {
          this.dataForm.patchValue(res.data);
        }
      }, error => {
        console.log(error);
      });
  }

  private editImageFolderData(data: ImageFolder) {
    this.imageFolderService.editImageFolderData(data)
      .subscribe(res => {
        this.uiService.success(res.message);
      }, error => {
        console.log(error);
      });
  }


}
