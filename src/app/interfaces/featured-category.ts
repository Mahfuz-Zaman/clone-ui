import {Product} from './product';
import {ProductCategory} from './product-category';

export interface FeaturedCategory {
  _id?: string;
  name: string;
  priority?: number;
  shortDesc: string;
  info?: string;
  image?: string;
  banner?: string;
  category: string | ProductCategory;
  routerLink?: string;
  cardBackground?: string;
  cardBtnColor?: string;
  products: string[] | Product[];
  createdAt?: string;
  updatedAt?: string;
}
