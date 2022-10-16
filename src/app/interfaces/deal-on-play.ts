import {Product} from './product';

export interface DealOnPlay {
  _id?: string;
  name: string;
  slug: string;
  priority?: number;
  shortDesc: string;
  info?: string;
  image?: string;
  routerLink?: string;
  cardBackground?: string;
  cardBtnColor?: string;
  products: string[] | Product[];
  createdAt?: string;
  updatedAt?: string;
}
