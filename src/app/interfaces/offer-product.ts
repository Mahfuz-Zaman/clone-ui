import {Product} from './product';
import {ProductCategory} from './product-category';
import {PromotionalOffer} from './promotional-offer';

export interface OfferProduct{
  _id: string;
  name: string;
  promotionalOffer: string | PromotionalOffer;
  promotionalOfferSlug?: string;
  category?: string | ProductCategory;
  products: string[] | Product[];
  createdAt: Date;
  description?: string;
}
