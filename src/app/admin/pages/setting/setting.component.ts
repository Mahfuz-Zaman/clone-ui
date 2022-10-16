import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Setting} from '../../../interfaces/setting';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {SettingService} from '../../../services/setting.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {

  dataForm?: FormGroup;
  private sub: Subscription;

  isLoading: any;
  setting: Setting;

  // Store Data from param
  id?: string;
  // // Destroy Session
  needSessionDestroy = true;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private router: Router,
    private settingService: SettingService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      cashOnDelivery: [false],
      onlinePayment: [false]
    });

    this.getSettingInfo();
  }

  onSubmit() {
    console.log(this.dataForm.value);
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }
    if (this.setting) {
      this.editSettingInfo(this.dataForm.value);
    } else {
      this.setSettingInfo(this.dataForm.value);
    }

  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private setSettingInfo(data: any) {
    this.spinner.show();
    this.settingService.setSettingInfo(data)
      .subscribe(res => {
        // console.log('sus add');
        this.uiService.success(res.message);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }


  private getSettingInfo() {
    this.spinner.show();
    this.settingService.getSettingInfo()
      .subscribe(res => {
        // console.log('get add');
        this.setting = res.data;
        if (this.setting) {
          this.dataForm.patchValue(this.setting);
        }
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }

  private editSettingInfo(data: any) {
    this.spinner.show();
    this.settingService.editSettingInfo(data)
      .subscribe(res => {
        // console.log('edit add');
        this.uiService.success(res.messsage);
        console.log('checking message', res.messsage);
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
        console.log(err);
      });
  }
}
