import {User} from './user';

export interface CertificateVerification {
  _id?: string;
  // refNumber: string;
  certificateNumber: string;
  storeName: string;
  dealerName: string;
  address: string;
  phoneNo: string;
  validity: string;
  select?: boolean;
}
