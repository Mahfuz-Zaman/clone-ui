import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {PasswordRecoveryRoutingModule} from './password-recovery-routing.module';
import {PasswordRecoveryComponent} from './password-recovery.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '../../material/material.module';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    PasswordRecoveryComponent
  ],
  imports: [
    CommonModule,
    PasswordRecoveryRoutingModule,
    AngularFireAuthModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ]
})
export class PasswordRecoveryModule { }
