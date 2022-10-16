import {Component, OnInit, ViewChild, OnDestroy} from '@angular/core';
import {UtilsService} from '../../../../services/utils.service';
import {UiService} from '../../../../services/ui.service';
import {ProductBrand} from '../../../../interfaces/product-brand';
import {ProductCategory} from '../../../../interfaces/product-category';
import {ProductSubCategory} from '../../../../interfaces/product-sub-category';
import {BrandService} from '../../../../services/brand.service';
import {CategoryService} from '../../../../services/category.service';
import {SubCategoryService} from '../../../../services/sub-category.service';
import {MatSelect, MatSelectChange} from '@angular/material/select';
import {CategoryMenu, HasChild2} from '../../../../interfaces/category-menu';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../../../../shared/components/ui/confirm-dialog/confirm-dialog.component';
import {MenuService} from '../../../../services/menu.service';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {Select} from '../../../../interfaces/select';
import {IconTypeEnum} from '../../../../enum/icon-type.enum';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-category-menu',
  templateUrl: './add-category-menu.component.html',
  styleUrls: ['./add-category-menu.component.scss']
})
export class AddCategoryMenuComponent implements OnInit , OnDestroy{

  //Subscription
  private subAcRoute : Subscription;
  private subCategorySer : Subscription;
  private subSubCatService : Subscription;
  private subBrandService : Subscription;
  private subMenuService : Subscription;
  private subMenuServiceOne : Subscription;
  private subMenuServiceTwo : Subscription;

  priority: number = null;
  iconType: string = null;
  iconName: string = null;
  catName: string = null;
  categoryMenu: CategoryMenu = null;

  // Store Product
  id: string = null;
  storedCategoryMenu: CategoryMenu = null;

  // SELECT DATA
  brands: ProductBrand[] = [];
  categories: ProductCategory[] = [];
  subCategories: ProductSubCategory[] = [];

  @ViewChild('inputElement') inputElement: any;
  @ViewChild('inputIconName') inputIconName: any;
  @ViewChild('inputIconType') inputIconType: MatSelect;
  @ViewChild('matSelectCat') matSelectCat: MatSelect;
  @ViewChild('matSelectSubCat') matSelectSubCat: MatSelect;

  // Dummy Data
  iconTypes: Select[] = [
    {value: IconTypeEnum.MATERIAL, viewValue: 'Material Icon'},
    {value: IconTypeEnum.FONT_AWESOME, viewValue: 'Font Awesome Icon'},
  ];


  constructor(
    private utilsService: UtilsService,
    private uiService: UiService,
    private brandService: BrandService,
    private categoryService: CategoryService,
    private subCategoryService: SubCategoryService,
    private menuService: MenuService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {


    this.getAllCategory();
    this.getAllBrands();

    // GET ID FORM PARAM
    this.subAcRoute = this.activatedRoute.paramMap.subscribe((param) => {
      this.id = param.get('id');

      if (this.id) {
        this.getCategoryMenuById();
      }
    });

  }

  /**
   * CONFIRM DIALOG
   */
  public openConfirmDialog() {
    if (!this.priority) {
      this.uiService.wrong('Priority is required');
      return;
    }

    // if (!this.iconType) {
    //   this.uiService.wrong('Icon Type is required');
    //   return;
    // }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: '400px',
      data: {
        title: 'Confirm Save',
        message: 'Are you sure you want save this menu?'
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        if (this.id) {
          this.updateCategoryMenu();
        } else {
          this.addNewCategoryMenu();
        }
      }
    });
  }


  /**
   * SELECTIONS
   */
  onSelectCategory(event: MatSelectChange) {
    this.categoryMenu = {
      id: event.value._id,
      name: event.value.categoryName,
      slug: event.value.categorySlug,
      hasChild: [],
      priority: this.priority
    };

    this.getSubCategoryByCategoryId(event.value._id);
    // console.log(this.primaryMenu);
  }

  onSelectSubCat(event: MatSelectChange) {
    this.categoryMenu.hasChild = event.value.map(m => {
      return {
        id: m._id,
        name: m.subCategoryName,
        slug: m.subCategorySlug,
        hasChild: [],
        priority: null,
      };
    });
  }

  onSelectSubCatBrand(event: MatSelectChange, index: number) {
    this.categoryMenu.hasChild[index].hasChild = event.value.map(m => {
      return {
        id: m._id,
        name: m.brandName,
        slug: m.brandSlug,
        hasChild: [],
        priority: null,
      };
    });
  }

  priorityChangeFn(event: any) {
    if (this.categoryMenu === null) {
      this.categoryMenu = {
        id: null,
        name: null,
        slug: null,
        hasChild: [],
        priority: event
      };
    } else {
      this.categoryMenu.priority = event;
    }

  }


  /**
   * HTTP REQ HANDLE
   */

  private getAllCategory() {
    this.subCategorySer = this.categoryService.getAllCategory()
      .subscribe(res => {
        this.categories = res.data;
      }, error => {
        console.log(error);
      });
  }

  private getSubCategoryByCategoryId(categoryId: string) {
    this.subSubCatService = this.subCategoryService.getSubCategoryByCategoryId(categoryId)
      .subscribe(res => {
        this.subCategories = res.data;
        if (this.id) {
          this.matSelectSubCat.value = this.subCategories.filter(arr1 =>
            this.categoryMenu.hasChild.filter(arr2 => arr2.id === arr1._id).length !== 0);

        }
      }, error => {
        console.log(error);
      });
  }

  private getAllBrands() {
    this.subBrandService = this.brandService.getAllBrands()
      .subscribe(res => {
        this.brands = res.data;
      }, error => {
        console.log(error);
      });
  }


  private addNewCategoryMenu() {
    this.spinner.show();
    const mData = {
      priority: this.priority,
      iconType: this.iconType,
      iconName: this.iconName
    };
    const finalData = {...this.categoryMenu, ...mData};
    this.subMenuService = this.menuService.addNewCategoryMenu(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.categoryMenu = null;
        this.subCategories = [];
        this.priority = null;
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private updateCategoryMenu() {
    this.spinner.show();
    const mData = {
      priority: this.priority,
      iconType: this.iconType,
      iconName: this.iconName
    };
    const finalData = {...this.categoryMenu, ...mData, ...{_id: this.id}};
    this.subMenuServiceOne = this.menuService.updateCategoryMenu(finalData)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  private getCategoryMenuById() {
    this.spinner.show();
    this.subMenuServiceTwo = this.menuService.getCategoryMenuById(this.id)
      .subscribe(res => {
        this.storedCategoryMenu = res.data;
        console.log('Data: ', res.data);
        this.categoryMenu = this.storedCategoryMenu;
        this.iconType = res.data.iconType;
        this.iconName = res.data.iconName;
        this.catName = res.data.name;
        this.getSubCategoryByCategoryId(this.categoryMenu.id);
        if (this.storedCategoryMenu) {
          this.setData();
        }
        this.spinner.hide();
      }, error => {
        console.log(error);
        this.spinner.hide();
      });
  }

  /**
   * SET DATA
   */

  private setData() {
    this.priority = this.storedCategoryMenu.priority;
    this.matSelectCat.value = this.categories.find(f => f._id === this.storedCategoryMenu.id);
  }

  getBrand(childBrands: HasChild2[]) {
    if (this.id) {
      return this.brands.filter(arr1 =>
        childBrands.filter(arr2 => arr2.id === arr1._id).length !== 0);
    } else {
      return null;
    }
  }

  // Destroy Subscription
  ngOnDestroy(): void {
      if(this.subAcRoute){
        this.subAcRoute.unsubscribe();
      }
      if(this.subCategorySer){
        this.subCategorySer.unsubscribe();
      }
      if(this.subSubCatService){
        this.subSubCatService.unsubscribe();
      }
      if(this.subBrandService){
        this.subBrandService.unsubscribe();
      }
      if(this.subMenuService){
        this.subMenuService.unsubscribe();
      }
      if(this.subMenuServiceOne){
        this.subMenuServiceOne.unsubscribe();
      }
      if(this.subMenuServiceTwo){
        this.subMenuServiceTwo.unsubscribe();
      }
  }
}
