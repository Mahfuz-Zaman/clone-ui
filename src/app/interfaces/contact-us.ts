export interface ContactUs {
  _id?: string;
  name: string;
  email: string;
  phoneNo: string;
  address?: string;
  queryType: number;
  subject?: string;
  message: string;
  receivingMails?: string[];
  emailSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
