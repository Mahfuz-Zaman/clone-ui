import {Product} from './product';
import {User} from './user';


export interface Review {
  title?: string;
  text: string;
  rating: number;
  createdAt?: Date;
  product?: string | Product;
  user?: string | User;
}
