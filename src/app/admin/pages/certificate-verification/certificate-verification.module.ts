import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MaterialModule} from '../../../material/material.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {NgxSpinnerModule} from 'ngx-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {CertificateVerificationComponent} from './certificate-verification.component';
import {WarrantyDashboardRoutingModule} from './certificate-verification-routing.module';
import { ViewCertificateVerificationComponent } from './view-certificate-verification/view-certificate-verification.component';
import { AddNewCertificateComponent } from './add-new-certificate/add-new-certificate.component';
// import { PreviewCertificateVerificationComponent } from '../../../pages/preview-certificate-verification/preview-certificate-verification.component';



@NgModule({
  declarations: [
    CertificateVerificationComponent,
    ViewCertificateVerificationComponent,
    AddNewCertificateComponent,
    // PreviewCertificateVerificationComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxSpinnerModule,
    NgxPaginationModule,
    WarrantyDashboardRoutingModule
  ]
})
export class CertificateVerificationModule { }
