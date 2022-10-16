import {User} from './user';

export interface Warranty {
  _id?: string;
  invoiceNumber: string;
  activationDate: string;
  productName: string;
  sku: string;
  warrantyPeriod: string;
  customerName: string;
  customerPhoneNo: string;
  user?: string | User;
  lastDownload?: string;
  totalDownload?: string;
}
