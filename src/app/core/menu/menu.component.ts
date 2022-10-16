import {AfterViewInit, Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {LangService} from '../../services/lang.service';
import {TranslateService} from '@ngx-translate/core';
import {MenuSide} from '../../interfaces/menu-side';
import {CategoryMenu} from '../../interfaces/category-menu';
import {NavigationEnd, Router} from '@angular/router';
import {MenuCtrService} from '../../services/menu-ctr.service';
import {ShopInfo} from '../../interfaces/shop-info';
import {MenuService} from '../../services/menu.service';
import {ShopService} from '../../services/shop.service';
import {PromotionalOfferService} from '../../services/promotional-offer.service';
import {PromotionalOffer} from '../../interfaces/promotional-offer';
import {InstallationRepairType} from '../../interfaces/installation-repair-type';
import {InstallationRepairTypeService} from '../../services/installation-repair-type.service';
import {AboutUs} from '../../interfaces/about-us';
import {AboutUsService} from '../../services/about-us.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, AfterViewInit {

  public showBackToTop = false;

  @ViewChild('sidenav', {static: true}) sidenav: any;

  // Language
  activeLang: string = null;
  browserLanguage: string = null;

  scrollPosition = 0;
  count = 0;

  // MENU
  menus: MenuSide[] = [
    {id: '1', name: 'Home', routerLink: '/', parentId: null, hasSubMenu: false, depth: 0},
    {id: '2', name: 'Products', routerLink: '/all-product-list', parentId: null, hasSubMenu: false, depth: 0},
    {id: '3', name: 'Installation & Repair', routerLink: null, parentId: null, hasSubMenu: true, depth: 0},
    {id: '4', name: 'Offers', routerLink: null, parentId: null, hasSubMenu: true, depth: 0},
    {id: '5', name: 'Blog', routerLink: '/blog', parentId: null, hasSubMenu: false, depth: 0},
    {id: '6', name: 'About Us', routerLink: null, parentId: null, hasSubMenu: true, depth: 0},
    {id: '7', name: 'Contact Us', routerLink: '/contact', parentId: null, hasSubMenu: false, depth: 0},
  ];


  // Category Menu
  categoryMenus: CategoryMenu[] = [];
  mCategoryMenus: MenuSide[] = [];

  // Data
  allPromotionalOffers: PromotionalOffer[] = [];
  allInstallationRepairTypes: InstallationRepairType[] = [];
  allAboutUsPages: AboutUs[] = [];
  shopInfo: ShopInfo = null;


  constructor(
    private breakpointObserver: BreakpointObserver,
    private langService: LangService,
    public translateService: TranslateService,
    private shopService: ShopService,
    private menuCtrService: MenuCtrService,
    public router: Router,
    private menuService: MenuService,
    private promotionalOfferService: PromotionalOfferService,
    private installationRepairTypeService: InstallationRepairTypeService,
    private aboutUsService: AboutUsService,
  ) {
    window.addEventListener('scroll', this.scrolling, true);
  }

  ngOnInit() {

    // this.getShopInfo();

    this.langService.languageChanged$.subscribe(data => {
      this.activeLang = data;
    });

    this.translateService.addLangs(['en', 'bn']);
    this.translateService.setDefaultLang('en');
    this.browserLanguage = this.translateService.getDefaultLang();
    this.translateService.use(this.browserLanguage.match(/en|bn/) ? this.browserLanguage : 'en');

    // GET DATA
    this.getAllCategoryMenu();
    this.getAllPromotionalOffer();
    this.getAllInstallationRepairType();
    this.getAboutUsPages();

  }

  public scrollToTop() {
    const scrollDuration = 200;
    const scrollStep = -window.pageYOffset / (scrollDuration / 20);
    const scrollInterval = setInterval(() => {
      if (window.pageYOffset !== 0) {
        window.scrollBy(0, scrollStep);
      } else {
        clearInterval(scrollInterval);
      }
    }, 10);
    if (window.innerWidth <= 768) {
      setTimeout(() => {
        window.scrollTo(0, 0);
      });
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll($event) {
    ($event.target.documentElement.scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false;
  }

  /**
   * Convert Menu to Menu Sidenav
   */

  private convertMenuToSideMenu() {
    const deep1: any[] = [];
    const deep2: any[] = [];
    const deep3: any[] = [];
    this.categoryMenus.forEach((f, i) => {
      const fData = {
        ...f,
        ...{parentId: null, routerLink: `/product-list/${f.slug}`, hasSubMenu: f.hasChild && f.hasChild.length > 0, depth: 1, hasChild: []}
      };
      deep1.push(fData);
      if (f.hasChild && f.hasChild.length > 0) {
        f.hasChild.forEach(g => {
          const gData = {
            ...g,
            ...{
              parentId: f.id,
              routerLink: `/product-list/${f.slug}/${g.slug}`,
              hasSubMenu: g.hasChild && g.hasChild.length > 0,
              depth: 2,
              hasChild: []
            }
          };
          deep2.push(gData);
          if (g.hasChild && g.hasChild.length > 0) {
            g.hasChild.forEach(h => {
              const hData = {
                ...h,
                ...{parentId: g.id, routerLink: `/product-list/${f.slug}/${g.slug}/${h.slug}`, hasSubMenu: false, depth: 3, hasChild: []}
              };
              deep3.push(hData);
            });
          }
        });
      }
    });

    const finalArray = [...deep1, ...deep2, ...deep3];
    this.mCategoryMenus = finalArray as MenuSide[];
  }

  private getShopInfo() {

    this.shopService.getShopInfo()
      .subscribe(res => {
        this.shopInfo = res.data;
        // getting social links
        // if (this.shopInfo.socialLinks) {
        //   this.facebookLinks = this.shopInfo.socialLinks.
        // }
      }, err => {
        console.log(err);
      });
  }


  // Scroll Control
  private scrolling = () => {
    this.scrollPosition = window.pageYOffset
      || document.documentElement.scrollTop
      || document.body.scrollTop || 0;
  }

  /**
   * ON CHANGE LANGUAGE
   */
  selectLang(lang: string) {
    this.langService.setLanguage$(lang);
    this.translateService.use(this.activeLang);

  }

  private getAllCategoryMenu() {
    this.menuService.getAllCategoryMenuNoRepeat()
      .subscribe(res => {
        this.categoryMenus = res.data;
        if (this.categoryMenus) {
          this.convertMenuToSideMenu();
        }
      }, error => {
        console.log(error);
      });
  }

  private getAllPromotionalOffer() {
    const select = 'title slug';
    this.promotionalOfferService.getAllPromotionalOffer(null, select)
      .subscribe(res => {
        this.allPromotionalOffers = res.data;
        const mPromoOffer = this.allPromotionalOffers.map(m => {
          return {
            id: m._id,
            name: m.title,
            routerLink: `/offers/${m.slug}`,
            parentId: '4',
            hasSubMenu: false,
            depth: 1
          };
        });
        this.menus = [...this.menus, ...mPromoOffer];
        this.count = this.count + 1;
      }, error => {
        console.log(error);
      });
  }

  private getAllInstallationRepairType() {
    const select = 'title slug';
    this.installationRepairTypeService.getAllInstallationRepairType(null, select)
      .subscribe(res => {
        this.allInstallationRepairTypes = res.data;
        const mInstall = this.allInstallationRepairTypes.map(m => {
          return {
            id: m._id,
            name: m.title,
            routerLink: `/view-installation-repair/${m.slug}`,
            parentId: '3',
            hasSubMenu: false,
            depth: 1
          };
        });
        this.menus = [...this.menus, ...mInstall];
        this.count = this.count + 1;
      }, error => {
        console.log(error);
      });
  }

  private getAboutUsPages() {
    const select = 'title slug';
    this.aboutUsService.getAboutUsPages(select)
      .subscribe(res => {
        this.allAboutUsPages = res.data;
        const mAboutUs = this.allAboutUsPages.map(m => {
          return {
            id: m._id,
            name: m.title,
            routerLink: `/about-us/${m.slug}`,
            parentId: '6',
            hasSubMenu: false,
            depth: 1
          };
        });
        this.menus = [...this.menus, ...mAboutUs];
        this.count = this.count + 1;
      }, error => {
        console.log(error);
      });
  }


  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.sidenav.close();
      }
    });
    this.menuCtrService.expandActiveSubMenu(this.menus);
  }


}
