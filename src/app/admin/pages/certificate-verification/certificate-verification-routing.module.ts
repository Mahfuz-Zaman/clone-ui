import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CertificateVerificationComponent} from './certificate-verification.component';
import {ViewCertificateVerificationComponent} from './view-certificate-verification/view-certificate-verification.component'
import {AddNewCertificateComponent} from './add-new-certificate/add-new-certificate.component';

const routes: Routes = [
  {path: '', component: CertificateVerificationComponent},
  {path: 'view-certificate-verification/:id', component: ViewCertificateVerificationComponent},
  {path: 'edit-certificate/:id', component: AddNewCertificateComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarrantyDashboardRoutingModule {
}
