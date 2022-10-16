import {Component, OnInit} from '@angular/core';
import {DealsOfTheDay} from '../../interfaces/deals-of-the-day';
import {DealOnPlay} from '../../interfaces/deal-on-play';
import {OfferProduct} from '../../interfaces/offer-product';
import {ActivatedRoute} from '@angular/router';
import {OfferProductService} from '../../services/offer-product.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PromotionalOffer} from '../../interfaces/promotional-offer';
import {PromotionalOfferService} from '../../services/promotional-offer.service';

@Component({
  selector: 'app-offer-view',
  templateUrl: './offer-view.component.html',
  styleUrls: ['./offer-view.component.scss']
})
export class OfferViewComponent implements OnInit {

  allDealsOfTheDay: DealsOfTheDay[] = [];
  dealOnPlay: DealOnPlay[] = [];
  PromoOfferSlug: string = null;
  offerProducts: OfferProduct[] = [];
  promotionalOffer: PromotionalOffer;

  constructor(
    private activatedRoute: ActivatedRoute,
    private offerProductService: OfferProductService,
    private promotionalOfferService: PromotionalOfferService,
    private spinner: NgxSpinnerService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(param => {
      this.PromoOfferSlug = param.get('slug');
      this.getSinglePromotionalOfferById();
      this.getOfferProductBySlug();
    });
  }

  /**
   * HTTP REQ
   */
  private getOfferProductBySlug() {
    this.spinner.show();
    this.offerProductService.getOfferProductBySlug(this.PromoOfferSlug)
      .subscribe(res => {
        this.offerProducts = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

  private getSinglePromotionalOfferById() {
    this.promotionalOfferService.getSinglePromotionalOfferBySlug(this.PromoOfferSlug)
      .subscribe(res => {
        this.promotionalOffer = res.data;
      }, error => {
        console.log(error);
      });
  }


}
