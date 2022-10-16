import { Component, OnInit } from '@angular/core';
import {AboutUs} from '../../interfaces/about-us';
import {ActivatedRoute} from '@angular/router';
import {InstallationRepairService} from '../../services/installation-repair.service';
import {InstallationRepairTypeService} from '../../services/installation-repair-type.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {AboutUsService} from '../../services/about-us.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  aboutUs: AboutUs;
  aboutUsSlug: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private aboutUsService: AboutUsService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.aboutUsSlug = param.get('slug');
      this.getSingleAboutUsBySlug();
    });
  }

  /**
   * HTTP REQ
   */
  private getSingleAboutUsBySlug() {
    this.spinner.show();
    this.aboutUsService.getSingleAboutUsBySlug(this.aboutUsSlug)
      .subscribe(res => {
        this.aboutUs = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

}
