import {PreviewCertificateVerificationComponent} from './preview-certificate-verification.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: ':certificateNumber', component: PreviewCertificateVerificationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreviewCertificateVerificationRoutingModule {
}
