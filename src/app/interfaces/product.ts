import {ProductAttribute} from './product-attribute';
import {ProductCategory} from './product-category';
import {ProductSubCategory} from './product-sub-category';
import {ProductBrand} from './product-brand';
import {ProductTag} from './product-tag';

export interface Product {
  _id: string;
  productName: string;
  productSlug: string;
  sku: string;
  price: number;
  discountType: number;
  discountAmount: number;
  quantity: number;
  soldQuantity: number;
  deliveredQuantity?: number;
  images: string[];
  // attributes: string[] | ProductAttribute[];
  attributes: ProductAttribute[];
  category: string | ProductCategory |any;
  categorySlug: string;
  subCategory: string | ProductSubCategory;
  subCategorySlug: string;
  brand: string | ProductBrand;
  brandSlug: string;
  warrantyServices: string;
  shortDescription: string;
  description: string;
  tags?: string[] | ProductTag[];
  ratingReview: any[];
  discussion: any[];
  filterData: FilterData[];
  createdAt: Date;
  updatedAt: Date;
  stockVisibility?: boolean;
  productVisibility?: boolean;
  deliveryPolicy?: string;
  paymentPolicy?: string;
  warrantyPolicy?: string;
  campaignStartDate?: any;
  campaignStartTime?: any;
  campaignEndDate?: any;
  campaignEndTime?: string;
  emiStatus?: number[];
  youtubeUrl?: string[];
  select?: boolean;
  // videoLink?:string;
}

export interface FilterData {
  _id: string;
  attributeName: string;
  attributeValues: string;
}
