import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PagesComponent} from './pages.component';
import {UserAuthStateGuard} from '../auth-guard/user-auth-state.guard';
import {UserAuthGuard} from '../auth-guard/user-auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
        data: { preload: true, delay: false },
      },
      {
        path: 'product-list',
        loadChildren: () =>
          import('./product-list/product-list.module').then(
            (m) => m.ProductListModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'brand-product-list',
        loadChildren: () =>
          import('./brand-product-list/brand-product-list.module').then(
            (m) => m.BrandProductListModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'account',
        canActivate: [UserAuthGuard],
        loadChildren: () =>
          import('./user/account/account.module').then((m) => m.AccountModule),
        data: { preload: true, delay: false },
      },
      {
        path: ':brandSlug/:subCategorySlug/:slug',
        loadChildren: () =>
          import('./product-details/product-details.module').then(
            (m) => m.ProductDetailsModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'all-product-list',
        loadChildren: () =>
          import('./all-product-list/all-product-list.module').then(
            (m) => m.AllProductListModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'all-product-list-calculation',
        loadChildren: () =>
          import('./all-product-list-calculation/all-product-list-calculation.module').then(
            (m) => m.AllProductListCalculationModule
          ),
        data: { preload: false, delay: false },
      },
      // {
      //   path: 'product-details/:slug',
      //   loadChildren: () => import('./product-details/product-details.module').then(m => m.ProductDetailsModule),
      //   data: {preload: true, delay: false}
      // },
      {
        path: 'offers',
        loadChildren: () =>
          import('./offer-view/offer-view.module').then(
            (m) => m.OfferViewModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'deal-on-play',
        loadChildren: () =>
          import('./deal-on-play/deal-on-play.module').then(
            (m) => m.DealOnPlayModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'registration',
        canActivate: [UserAuthStateGuard],
        loadChildren: () =>
          import('./user/registration/registration.module').then(
            (m) => m.RegistrationModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'login',
        canActivate: [UserAuthStateGuard],
        loadChildren: () =>
          import('./user/login/login.module').then((m) => m.LoginModule),
        data: { preload: true, delay: false },
      },
      {
        path: 'password-recovery',
        loadChildren: () =>
          import('./password-recovery/password-recovery.module').then(
            (m) => m.PasswordRecoveryModule
          ),
        data: { preload: false, delay: true },
      },
      {
        path: 'cart',
        loadChildren: () =>
          import('./user/cart/cart.module').then((m) => m.CartModule),
        data: { preload: true, delay: false },
      },
      {
        path: 'checkout',
        canActivate: [UserAuthGuard],
        loadChildren: () =>
          import('./user/checkout/checkout.module').then(
            (m) => m.CheckoutModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'store-locator',
        loadChildren: () =>
          import('./store-locator/store-locator.module').then(
            (m) => m.StoreLocatorModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'dealer-locator',
        loadChildren: () =>
          import('./dealer-locator/dealer-locator.module').then(
            (m) => m.DealerLocatorModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'top-brands',
        loadChildren: () =>
          import('./top-brands/top-brands.module').then(
            (m) => m.TopBrandsModule
          ),
        data: { preload: true, delay: false },
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./additional-page-view/additional-page-view.module').then(
            (m) => m.AdditionalPageViewModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'payment',
        loadChildren: () =>
          import('./payment/payment.module').then((m) => m.PaymentModule),
        data: { preload: true, delay: false },
      },
      {
        path: 'coming-soon',
        loadChildren: () =>
          import('./coming-soon/coming-soon.module').then(
            (m) => m.ComingSoonModule
          ),
        data: { preload: false, delay: true },
      },
      {
        path: 'test',
        loadChildren: () =>
          import('./test/test.module').then((m) => m.TestModule),
        data: { preload: false, delay: true },
      },
      {
        path: 'contact',
        loadChildren: () =>
          import('./contact/contact.module').then((m) => m.ContactModule),
        data: { preload: false, delay: true },
      },
      {
        path: 'contact-service-center',
        loadChildren: () =>
          import('./submit-complaint/submit-complaint.module').then(
            (m) => m.SubmitComplaintModule
          ),
      },

      {
        path: 'after-sales-support',
        loadChildren: () =>
          import('./after-sales-support/after-sales-support.module').then(
            (m) => m.AfterSalesSupportModule
          ),
      },
      {
        path: 'blog',
        loadChildren: () =>
          import('./blog/blog.module').then((m) => m.BlogModule),
        data: { preload: false, delay: true },
      },
      {
        path: 'view-installation-repair',
        loadChildren: () =>
          import('./view-installation-repair/installation-repair.module').then(
            (m) => m.InstallationRepairModule
          ),
        data: { preload: false, delay: false },
      },
      {
        path: 'about-us',
        loadChildren: () =>
          import('./about-us/about-us.module').then((m) => m.AboutUsModule),
        data: { preload: false, delay: false },
      },
      {
        path: 'compare',
        loadChildren: () =>
          import('./compare/compare.module').then((m) => m.CompareModule),
        data: { preload: false, delay: false },
      },
      {
        path: 'career-esquire',
        loadChildren: () =>
          import('./career-esquire/career-esquire.module').then(
            (m) => m.CareerEsquireModule
          ),
        data: { preload: false, delay: true },
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then((m) => m.FAQModule),
        data: { preload: false, delay: true },
      },
      {
        path: 'product-authenticator',
        loadChildren: () =>
          import('./product-authenticator/product-authenticator.module').then(
            (m) => m.ProductAuthenticatorModule
          ),
        data: { preload: false, delay: true },
      },
      {
        path: 'certificate-verifications',
        loadChildren: () =>
          import(
            './preview-certificate-verification/preview-certificate-verification.module'
          ).then((m) => m.PreviewCertificateVerificationModule),
        data: { preload: false, delay: true },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [UserAuthGuard, UserAuthStateGuard]
})
export class PagesRoutingModule {
}
