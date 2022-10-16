export interface ShippingAddress {
  _id?: string;
  addressType: number;
  name: string;
  phoneNo: string;
  alternativePhoneNo?: string;
  city: string;
  area: string;
  zone?: string;
  shippingAddress: string;
}
