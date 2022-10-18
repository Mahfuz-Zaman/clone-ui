import { Component, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { MenuService } from '../../services/menu.service';
import { ShopService } from '../../services/shop.service';
import { ProductCategory } from '../../interfaces/product-category';
import { CategoryService } from '../../services/category.service';
import { DealOnPlay } from '../../interfaces/deal-on-play';
import { FeaturedCategory } from '../../interfaces/featured-category';
import { DealOnPlayService } from '../../services/deal-on-play.service';
import { FeaturedCategoryService } from '../../services/featured-category.service';
import { FeaturedProduct } from '../../interfaces/featured-product';
import { FeaturedProductService } from '../../services/featured-product.service';
import { Select } from '../../interfaces/select';
import { CustomizationService } from '../../services/customization.service';
import { Carousel } from '../../interfaces/carousel';
import { DealsOfTheDay } from '../../interfaces/deals-of-the-day';
import { DealsOfTheDayService } from '../../services/deals-of-the-day.service';
import { ProductBrand } from '../../interfaces/product-brand';
import { BrandService } from '../../services/brand.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { Banner } from '../../interfaces/banner';
import { BannerService } from '../../services/banner.service';
import { Meta, Title } from '@angular/platform-browser';
import { CanonicalService } from '../../services/canonical.service';
import { Pagination } from '../../interfaces/pagination';
import { FacebookService, InitParams } from 'ngx-facebook';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  recommendedProducts: Product[] = [];

  carousels: Carousel[] = [
    { url: '/', image: null, mobileImage: null, title: '', _id: '' },
  ];

  offers: any[] = [];

  brandList: any[] = [];
  electronics: any[] = [];

  banner: Banner;
  bigBanner: Banner;
  offerBanner: Banner;

  // Store Data
  categories: ProductCategory[] = [];
  dealOnPlay: DealOnPlay[] = [];
  allDealsOfTheDay: DealsOfTheDay[] = [];
  brands: ProductBrand[] = [];
  featuredCategory: FeaturedCategory[] = [];
  allFeaturedProduct: FeaturedProduct[] = [];
  activeFeaturedProduct: string;

  // Dummy Data
  featureProductTypes: Select[] = [
    {
      value: 'featured',
      viewValue: 'Featured',
    },
    {
      value: 'best-seller',
      viewValue: 'Best Seller',
    },
    {
      value: 'special-product',
      viewValue: 'Special Product',
    },
  ];

  constructor(
    private menuService: MenuService,
    private shopService: ShopService,
    private categoryService: CategoryService,
    private dealOnPlayService: DealOnPlayService,
    private dealsOfTheDayService: DealsOfTheDayService,
    private featuredCategoryService: FeaturedCategoryService,
    private featuredProductService: FeaturedProductService,
    private customizationService: CustomizationService,
    private brandService: BrandService,
    private productService: ProductService,
    private storageService: StorageService,
    private bannerService: BannerService,
    private title: Title,
    private meta: Meta,
    private canonicalService: CanonicalService,
    private facebookService: FacebookService
  ) {
    this.updateMetaData();
  }

  ngOnInit(): void {
    // GET DATA
    this.getAllCarousel();
    this.getAllCategory();
    this.getAllDealsOfTheDay();
    this.getAllDealOnPLay();
    this.getAllFeaturedCategory();
    this.getAllBrands();
    this.activeFeaturedProduct = this.featureProductTypes[0].value;
    this.getAllFeaturedProduct(this.featureProductTypes[0].value);
    this.getAllBanner();
    this.getRecommendedProducts();
    // Init Facebook Service
    this.initFacebookService();
  }

  /**
   * HTTP REQ HANDLE
   */

  // private getAllBanner() {
  //   const p: Pagination = {
  //     currentPage: '1',
  //     pageSize: '1'
  //   };
  //
  //   const select = 'name image routerLink -_id';
  //
  //   this.bannerService.getAllBanner(p, 'bigBanner', select)
  //     .subscribe(res => {
  //       this.banner = res.data ? res.data[0] : null;
  //     }, error => {
  //       console.log(error);
  //     });
  // }

  private getAllBanner() {
    this.bannerService.getAllBanner().subscribe(
      (res) => {
        // console.log(res.data);
        for (const banner of res.data) {
          if (banner.bannerType === 'bigBanner') {
            this.bigBanner = banner;
            // console.log('this is big banner');
            // console.log(this.bigBanner);
          }
          if (banner.bannerType === 'offerBanner') {
            this.offerBanner = banner;
            // console.log('this is offer banner');
            // console.log(this.offerBanner);
          }
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllCarousel() {
    const select = 'image mobileImage url -_id';
    this.customizationService.getAllCarouselNoRepeat(select).subscribe(
      (res) => {
        console.log('see the carosel', res.data);
        this.carousels = res.data;
        console.log('see the Mobile', this.carousels);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllCategory() {
    const select = 'categoryName categorySlug image priority -_id';
    this.categoryService.getAllCategoryNoRepeat(select).subscribe(
      (res) => {
        this.categories = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllDealsOfTheDay() {
    this.dealsOfTheDayService.getAllDealsOfTheDayNoRepeat().subscribe(
      (res) => {
        if (res.data) {
          this.allDealsOfTheDay = res.data.filter((item) => item.product);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllDealOnPLay() {
    this.dealOnPlayService.getAllDealOnPlayNoRepeat().subscribe(
      (res) => {
        this.dealOnPlay = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllFeaturedCategory() {
    this.featuredCategoryService.getAllFeaturedCategoryNoRepeat().subscribe(
      (res) => {
        this.featuredCategory = res.data;
        console.log('Featured Category');
        console.log(res.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  public getAllFeaturedProduct(type: string) {
    this.activeFeaturedProduct = type;
    this.featuredProductService.getAllFeaturedProductNoRepeat(type).subscribe(
      (res) => {
        if (res.data) {
          this.allFeaturedProduct = res.data.filter((item) => item.product);
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getAllBrands() {
    this.brandService.getAllBrandsNoRepeat().subscribe(
      (res) => {
        this.brands = res.data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  private getRecommendedProducts() {
    this.productService
      .getRecommendedProducts(this.storageService.getViewedProductData())
      .subscribe(
        (res) => {
          this.recommendedProducts = res.data.filter(
            (item) =>
              item.quantity &&
              item.quantity > 0 &&
              item.productVisibility === true
          );
          console.log('this recommended products');
          console.log(res.data);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  /**
   * SEO TITLE
   * SEO META TAGS
   */

  private updateMetaData() {
    // Title
    this.title.setTitle('GadgetEX - Home');
    // Meta
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({
      name: 'description',
      content:
        'GadgetEx is the sole authorized distributor of SHARP and GENERAL in Bangladesh. Shop online and enjoy massive discounts and free home delivery.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'online shop, GadgetEx, GadgetEx, GadgetEx, GadgetEx.com',
    });
    // Facebook
    this.meta.updateTag({
      name: 'og:title',
      content: 'GadgetEx - Home',
    });
    this.meta.updateTag({ name: 'og:type', content: 'website' });
    this.meta.updateTag({
      name: 'og:url',
      content: 'https://support@gadgetex.com.bd/',
    });
    this.meta.updateTag({
      name: 'og:image',
      content: 'https://support@gadgetex.com.bd/assets/brand/esquire.png',
    });
    this.meta.updateTag({
      name: 'og:description',
      content:
        'GadgetEx. is the sole authorized distributor of SHARP and GENERAL in Bangladesh. Shop online and enjoy massive discounts and free home delivery.',
    });
    // Twitter
    this.meta.updateTag({
      name: 'twitter:title',
      content: 'GadgetEx - Home',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://support@gadgetex.com.bd/assets/brand/esquire.png',
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content:
        'GadgetEx. is the sole authorized distributor of SHARP and GENERAL in Bangladesh. Shop online and enjoy massive discounts and free home delivery.',
    });

    // Canonical
    this.canonicalService.setCanonicalURL();
  }

  /**
   * INIT FACEBOOK
   */
  private initFacebookService(): void {
    const initParams: InitParams = { xfbml: true, version: 'v11.0' };
    this.facebookService.init(initParams);
  }
}
