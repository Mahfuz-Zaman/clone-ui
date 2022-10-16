export interface FooterData {
  _id?: string;
  shortDes?: string;
  address?: string;
  phone?: string;
  email?: string;
  aboutEsquire?: string;
  title1?: string;
  title1Des?: string;
  title2?: string;
  title2Des?: string;
  title3?: string;
  title3Des?: string;
  title4?: string;
  title4Des?: string;
  title5?: string;
  title5Des?: string;
  socialLinks?: LinkObject[];
}

export interface LinkObject {
  type: string;
  value: string;
}

