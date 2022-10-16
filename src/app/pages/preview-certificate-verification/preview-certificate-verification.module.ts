import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreviewCertificateVerificationRoutingModule } from './preview-certificate-verification-routing.module';
import {MaterialModule} from '../../material/material.module';
import { PreviewCertificateVerificationComponent } from './preview-certificate-verification.component';



@NgModule({
  declarations: [PreviewCertificateVerificationComponent],
  imports: [
    CommonModule,
    PreviewCertificateVerificationRoutingModule,
    MaterialModule
  ]
})
export class PreviewCertificateVerificationModule { }
