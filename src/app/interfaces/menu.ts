export interface Menu {
  name: string;
  url: string;
  categories: CategoryMenu[];
}

export interface CategoryMenu {
  name: string;
  url: string;
  subCategories: SubCategoryMenu[];
}

export interface SubCategoryMenu {
  name: string;
  url: string;
}
