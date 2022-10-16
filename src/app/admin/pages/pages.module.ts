import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PagesComponent} from './pages.component';
import {RouterModule, Routes} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {SidenavListComponent} from './components/sidenav-list/sidenav-list.component';
import {SharedModule} from '../../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatNativeDateModule, MatRippleModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import {MatListModule} from '@angular/material/list';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditorAuthRoleGuard} from '../../auth-guard/editor-auth-role.guard';
import {ProductTableComponent} from './components/product-table/product-table.component';
import {PipesModule} from '../../shared/pipes/pipes.module';
import {NgxPaginationModule} from 'ngx-pagination';
import {ProductViewTableOneComponent} from './components/product-view-table-one/product-view-table-one.component';
import {AdminAuthRoleGuard} from '../../auth-guard/admin-auth-role.guard';
import {CheckAuthAccessGuard} from '../../auth-guard/check-auth-access.guard';
import { AddProductListBannerComponent } from './add-product-list-banner/add-product-list-banner.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'category-menu',
        loadChildren: () =>
          import('./category-menu/category-menu.module').then(
            (m) => m.CategoryMenuModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'carousel',
        loadChildren: () =>
          import('./carousels/carousels.module').then((m) => m.CarouselsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'shop-info',
        loadChildren: () =>
          import('./shop-info/shop-info.module').then((m) => m.ShopInfoModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'attributes',
        loadChildren: () =>
          import('./attributes/attributes.module').then(
            (m) => m.AttributesModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'tags',
        loadChildren: () =>
          import('./tags/tags.module').then((m) => m.TagsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'brands',
        loadChildren: () =>
          import('./brands/brands.module').then((m) => m.BrandsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'categories',
        loadChildren: () =>
          import('./categories/categories.module').then(
            (m) => m.CategoriesModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'sub-categories',
        loadChildren: () =>
          import('./sub-categories/sub-categories.module').then(
            (m) => m.SubCategoriesModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./products/products.module').then((m) => m.ProductsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'add-product',
        loadChildren: () =>
          import('./products/add-product/add-product.module').then(
            (m) => m.AddProductModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'deal-on-play',
        loadChildren: () =>
          import('./deal-on-play/deal-on-play.module').then(
            (m) => m.DealOnPlayModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'deal-of-the-day',
        loadChildren: () =>
          import('./deals-of-the-day/deals-of-the-day.module').then(
            (m) => m.DealsOfTheDayModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'featured-product',
        loadChildren: () =>
          import('./featured-product/featured-product.module').then(
            (m) => m.FeaturedProductModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'featured-category',
        loadChildren: () =>
          import('./featured-category/featured-category.module').then(
            (m) => m.FeaturedCategoryModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'image-gallery',
        loadChildren: () =>
          import('./image-gallery/image-gallery.module').then(
            (m) => m.ImageGalleryModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'image-folder',
        loadChildren: () =>
          import('./image-folder/image-folder.module').then(
            (m) => m.ImageFolderModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'additional-pages',
        loadChildren: () =>
          import('./additional-pages/additional-pages.module').then(
            (m) => m.AdditionalPagesModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'shipping-charge',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./shipping-charge/shipping-charge.module').then(
            (m) => m.ShippingChargeModule
          ),
      },
      {
        path: 'orders',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./orders/orders.module').then((m) => m.OrdersModule),
      },
      {
        path: 'transactions',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./transactions/transactions.module').then(
            (m) => m.TransactionsModule
          ),
      },
      {
        path: 'warranty-dashboard',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./warranty-dashboard/warranty-dashboard.module').then(
            (m) => m.WarrantyDashboardModule
          ),
      },
      {
        path: 'product-authenticators',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./product-authenticators/product-authenticators.module').then(
            (m) => m.ProductAuthenticatorsModule
          ),
      },
      {
        path: 'customers',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./customers/customers.module').then((m) => m.CustomersModule),
      },
      {
        path: 'newsletter',
        loadChildren: () =>
          import('./newsletter/newsletter.module').then(
            (m) => m.NewsletterModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'contact-us',
        loadChildren: () =>
          import('./contact-us/contact-us.module').then(
            (m) => m.ContactUsModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'coupons',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./coupons/coupons.module').then((m) => m.CouponsModule),
      },
      {
        path: 'store-info',
        loadChildren: () =>
          import('./store-info/store-info.module').then(
            (m) => m.StoreInfoModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'dealer-info',
        loadChildren: () =>
          import('./dealer-info/dealer-info.module').then(
            (m) => m.DealerInfoModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'certificate-verification',
        loadChildren: () =>
          import(
            './certificate-verification/certificate-verification.module'
          ).then((m) => m.CertificateVerificationModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'users',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'roles',
        canActivate: [CheckAuthAccessGuard, EditorAuthRoleGuard],
        loadChildren: () =>
          import('./roles/roles.module').then((m) => m.RolesModule),
      },
      {
        path: 'my-profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'reviews',
        loadChildren: () =>
          import('./reviews/reviews.module').then((m) => m.ReviewsModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'promotional-offer',
        loadChildren: () =>
          import('./promotional-offer/promotional-offer.module').then(
            (m) => m.PromotionalOfferModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'offer-products',
        loadChildren: () =>
          import('./offer-product/offer-product.module').then(
            (m) => m.OfferProductModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'banner',
        loadChildren: () =>
          import('./banner/banner.module').then((m) => m.BannerModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'blogs',
        loadChildren: () =>
          import('./blog/blog.module').then((m) => m.BlogModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'installations-and-repair',
        loadChildren: () =>
          import('./installations-repair/installations-repair.module').then(
            (m) => m.InstallationsRepairModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'installations-and-repair-type',
        loadChildren: () =>
          import(
            './installation-repair-types/installation-repair-types.module'
          ).then((m) => m.InstallationRepairTypesModule),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'about-us-pages',
        loadChildren: () =>
          import('./about-us-pages/about-us-pages.module').then(
            (m) => m.AboutUsPagesModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'footer-data',
        loadChildren: () =>
          import('./footer-data/footer-data.module').then(
            (m) => m.FooterDataModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'career-esquire',
        loadChildren: () =>
          import('./career-esquire/career-esquire.module').then(
            (m) => m.CareerEsquireModule
          ),
        canActivate: [CheckAuthAccessGuard],
      },
      {
        path: 'promo-page',
        loadChildren: () =>
          import('./promo-page/promo-page.module').then(
            (m) => m.PromoPageModule
          ),
      },
      {
        path: 'product-promo-banner',
        loadChildren: () =>
          import('./product-promo-banner/product-promo-banner.module').then(
            (m) => m.ProductPromoBannerModule
          ),
      },
      {
        path: 'discussions',
        loadChildren: () =>
          import('./discussion/discussion.module').then(
            (m) => m.DiscussionModule
          ),
      },
      {
        path: 'best-sell-products',
        loadChildren: () =>
          import('./best-sells-products/best-sells-products.module').then(
            (m) => m.BestSellsProductsModule
          ),
      },
      {
        path: 'faq',
        loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
      },
      {
        path: 'backup-restore',
        loadChildren: () =>
          import('./backup-restore/backup-restore.module').then(
            (m) => m.BackupRestoreModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
      {
        path: 'product-list-banner',
        loadChildren: () =>
          import('./product-list-banner/product-list-banner.module').then(
            (m) => m.ProductListBannerModule
          ),
        canActivate: [EditorAuthRoleGuard],
      },
      {
        path: 'setting',
        loadChildren: () =>
          import('./setting/setting.module').then((m) => m.SettingModule),
        canActivate: [EditorAuthRoleGuard],
      },
    ],
  },
];

@NgModule({
  declarations: [
    PagesComponent,
    HeaderComponent,
    SidenavListComponent,
    ProductTableComponent,
    ProductViewTableOneComponent,
    AddProductListBannerComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatMenuModule,
    RouterModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatListModule,
    MatNativeDateModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    PipesModule,
    FormsModule,
    NgxPaginationModule
  ],
  exports: [
    ProductViewTableOneComponent
  ],
  providers: [AdminAuthRoleGuard, EditorAuthRoleGuard, CheckAuthAccessGuard]
})
export class PagesModule {
}
