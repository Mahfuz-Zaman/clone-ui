import {Product} from './product';
import {InstallationRepairType} from './installation-repair-type';

export interface InstallationRepair {
  _id: string;
  name: string;
  installationRepairType: string | InstallationRepairType;
  installationRepairTypeSlug?: string;
  products: string[] | Product[];
  createdAt: Date;
}
