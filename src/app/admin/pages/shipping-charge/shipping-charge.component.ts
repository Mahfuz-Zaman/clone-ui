import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {UiService} from '../../../services/ui.service';
import {TagService} from '../../../services/tag.service';
import {ShippingChargeService} from '../../../services/shipping-charge';
import {ShippingCharge} from '../../../interfaces/shippingcharge';

@Component({
  selector: 'app-shipping-charge',
  templateUrl: './shipping-charge.component.html',
  styleUrls: ['./shipping-charge.component.scss']
})
export class ShippingChargeComponent implements OnInit {

  dataForm?: FormGroup;
  private sub: Subscription;

  shippingchargedata: ShippingCharge;
  autoSlug = true;
  isLoading = false;

  // Store Data from param
  id?: string;

  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private uiService: UiService,
    private tagService: TagService,
    private router: Router,
    private shippingChargeService: ShippingChargeService
  ) {
  }

  ngOnInit(): void {
    this.dataForm = this.fb.group({
      deliveryInDhaka: [null, Validators.required],
      deliveryOutsideDhaka: [null, Validators.required]
    });


    this.getExtraPriceInfo();
  }

  onSubmit() {
    if (this.dataForm.invalid) {
      this.uiService.warn('Please complete all the required fields');
      return;
    }

    if (this.shippingchargedata) {
      this.editExtraInfo(this.dataForm.value);
    } else {
      this.setExtraPriceInfo(this.dataForm.value);
    }
  }


  /**
   * HTTP REQ HANDLE
   * GET ATTRIBUTES BY ID
   */

  private setExtraPriceInfo(data: any) {
    this.shippingChargeService.setExtraPriceInfo(data)
      .subscribe(res => {
        // console.log('sus add');
        this.uiService.success(res.message);

      }, err => {
        console.log(err);
      });
  }


  private getExtraPriceInfo() {
    this.shippingChargeService.getExtraPriceInfo()
      .subscribe(res => {
        // console.log('get add');
        this.shippingchargedata = res.data;
        if (this.shippingchargedata) {
          this.dataForm.patchValue(this.shippingchargedata);
        }


      }, err => {
        console.log(err);
      });
  }


  private editExtraInfo(data: any) {
    this.shippingChargeService.editExtraInfo(data)
      .subscribe(res => {
        // console.log('edit add');
        this.uiService.success(res.messsage);

      }, err => {
        console.log(err);
      });
  }


}
