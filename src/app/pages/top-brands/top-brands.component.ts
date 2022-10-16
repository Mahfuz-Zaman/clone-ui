import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {BrandService} from '../../services/brand.service';

@Component({
  selector: 'app-top-brands',
  templateUrl: './top-brands.component.html',
  styleUrls: ['./top-brands.component.scss']
})
export class TopBrandsComponent implements OnInit {

  promotionalBrands: any[] = [];
  otherBrands: any[] = [];

  // Pagination
  currentPage = 1;
  totalProducts = 0;
  productsPerPage = 12;

  constructor(
    private brandService: BrandService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getAllPromotionalBrands();
    this.getAllOtherBrands();
    // console.log(this.router.url);
  }

  /**
   * Fetch all promotional Brand data
   */
  private getAllPromotionalBrands() {
    this.brandService.getAllPromotionalBrands()
      .subscribe(res => {
        this.promotionalBrands = res.data;
        // console.log(this.promotionalBrands);
      }, error => {
        console.log(error);
      });
  }

  /**
   * Fetch all Other Brand data
   */
  private getAllOtherBrands() {
    this.brandService.getAllOtherBrands()
      .subscribe(res => {
        this.otherBrands = res.data;
        this.totalProducts = res.count;
        // console.log(this.promotionalBrands);
      }, error => {
        console.log(error);
      });
  }




  /**
   * NGX PAGINATION CHANGED
   */

  public onChangePage(event: number) {
    this.router.navigate([], {queryParams: {page: event}});
  }


}
