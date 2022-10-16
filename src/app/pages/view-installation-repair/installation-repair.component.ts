import { Component, OnInit } from '@angular/core';
import {InstallationRepair} from '../../interfaces/installation-repair';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {InstallationRepairService} from '../../services/installation-repair.service';
import {InstallationRepairTypeService} from '../../services/installation-repair-type.service';
import {InstallationRepairType} from '../../interfaces/installation-repair-type';

@Component({
  selector: 'app-installation-repair',
  templateUrl: './installation-repair.component.html',
  styleUrls: ['./installation-repair.component.scss']
})
export class InstallationRepairComponent implements OnInit {

  installationRepairTypeSlug: string = null;
  installationRepairs: InstallationRepair[] = [];
  installationRepairType: InstallationRepairType;

  constructor(
    private activatedRoute: ActivatedRoute,
    private installationRepairService: InstallationRepairService,
    private installationRepairTypeService: InstallationRepairTypeService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.installationRepairTypeSlug = param.get('slug');
      this.getSingleInstallationRepairTypeBySlug();
      this.getInstallationRepairBySlug();
    });
  }

  /**
   * HTTP REQ
   */
  private getInstallationRepairBySlug() {
    this.spinner.show();
    this.installationRepairService.getInstallationRepairBySlug(this.installationRepairTypeSlug)
      .subscribe(res => {
        this.installationRepairs = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSingleInstallationRepairTypeBySlug() {
    this.installationRepairTypeService.getSingleInstallationRepairTypeBySlug(this.installationRepairTypeSlug)
      .subscribe(res => {
        this.installationRepairType = res.data;
      }, error => {
        console.log(error);
      });
  }

}
