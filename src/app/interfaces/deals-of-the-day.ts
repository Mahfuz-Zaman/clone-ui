import {Product} from './product';

export interface DealsOfTheDay{
  _id: string;
  name: string;
  desc: string;
  slug: string;
  startDate: string;
  endDate: string;
  priority: number;
  product: string | Product;
}
