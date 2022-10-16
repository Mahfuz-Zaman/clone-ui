import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SnackbarNotificationComponent} from './components/ui/snackbar-notification/snackbar-notification.component';
import {MessageDialogComponent} from './components/ui/message-dialog/message-dialog.component';
import {ConfirmDialogComponent} from './components/ui/confirm-dialog/confirm-dialog.component';
import {NgxSpinnerModule} from 'ngx-spinner';
import {LangTranslateModule} from '../core/lang-translate/lang-translate.module';
import {MaterialModule} from '../material/material.module';
import {RouterModule} from '@angular/router';
import {FooterComponent} from './components/footer/footer.component';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {OutSideClickDirective} from './directives/out-side-click.directive';
import {FlexLayoutServerModule} from '@angular/flex-layout/server';
import {CartViewDialogComponent} from './components/cart-view-dialog/cart-view-dialog.component';
import {PipesModule} from './pipes/pipes.module';
import {FormsModule} from '@angular/forms';
import {BottomSheetViewComponent} from './components/ui/bottom-sheet-view/bottom-sheet-view.component';
import {CookieConsentComponent} from './components/cookie-consent/cookie-consent.component';
import { PhoneForceComponent } from './dialog-view/phone-force/phone-force.component';


@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    LangTranslateModule,
    NgxSpinnerModule,
    MaterialModule,
    RouterModule,
    PipesModule,
    FormsModule
  ],
  exports: [
    FlexLayoutModule,
    FlexLayoutServerModule,
    SnackbarNotificationComponent,
    MessageDialogComponent,
    LangTranslateModule,
    NgxSpinnerModule,
    FooterComponent,
    ProductCardComponent,

    OutSideClickDirective,
    CartViewDialogComponent,
    BottomSheetViewComponent,
    CookieConsentComponent
  ],
  declarations: [
    SnackbarNotificationComponent,
    MessageDialogComponent,
    ConfirmDialogComponent,
    FooterComponent,
    ProductCardComponent,
    OutSideClickDirective,
    CartViewDialogComponent,
    BottomSheetViewComponent,
    CookieConsentComponent,
    // PhoneForceComponent,
  ],
  providers: [],
  entryComponents: []
})
export class SharedModule {
}
