import {ProductBrand} from './product-brand';
import {ProductCategory} from './product-category';
import {ProductAttribute} from './product-attribute';

export interface ProductSubCategory {
  readOnly?: boolean;
  _id?: string;
  subCategoryName: string;
  subCategorySlug: string;
  brand: string | ProductBrand;
  category: string | ProductCategory;
  attributes: string[] |  ProductAttribute[];
}
