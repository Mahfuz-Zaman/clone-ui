import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DealOnPlayService} from '../../services/deal-on-play.service';
import {DealOnPlay} from '../../interfaces/deal-on-play';
import {NgxSpinnerService} from 'ngx-spinner';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-deal-on-play',
  templateUrl: './deal-on-play.component.html',
  styleUrls: ['./deal-on-play.component.scss']
})
export class DealOnPlayComponent implements OnInit, OnDestroy {

  // Subscription
  private subActiveRoute: Subscription;
  private subDealOnPlayService: Subscription;

  dealOnPlay?: DealOnPlay = null;

  // ID
  id?: string = null;
  slug?: string = null;
  products: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private dealOnPlayService: DealOnPlayService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.subActiveRoute = this.activatedRoute.paramMap.subscribe(param => {
      // this.id = param.get('id');
      // if (this.id) {
      //   this.getSingleDealOnPlayById();
      // }
      this.slug = param.get('slug');
      // console.log('Slug', this.slug);
      if (this.slug) {
        this.getSingleDealOnPlayBySlug();
      }
    });
  }


  /**
   * HTTP REQ HANDLE
   */

  private getSingleDealOnPlayById() {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subDealOnPlayService = this.dealOnPlayService.getSingleDealOnPlayById(this.id, selectProductField)
      .subscribe(res => {
        this.dealOnPlay = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSingleDealOnPlayBySlug() {
    this.spinner.show();
    const selectProductField = '-attributes -filterData -tags -ratingReview -discussion -warrantyServices -description';
    this.subDealOnPlayService = this.dealOnPlayService.getSingleDealOnPlayBySlug(this.slug, selectProductField)
      .subscribe(res => {
        this.dealOnPlay = res.data;
        // @ts-ignore
        this.products = this.dealOnPlay.products.filter(item=> item.productVisibility === true);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  ngOnDestroy(): void {
    if (this.subActiveRoute) {
      this.subActiveRoute.unsubscribe();
    }
    if (this.subDealOnPlayService) {
      this.subDealOnPlayService.unsubscribe();
    }
  }

}
