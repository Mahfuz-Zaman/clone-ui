import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-rating-view',
  templateUrl: './product-rating-view.component.html',
  styleUrls: ['./product-rating-view.component.scss']
})
export class ProductRatingViewComponent implements OnInit {

  @Input() ratingValue = 0;
  @Input() ratingCount = 0;
  ratingMax = 5;

  ratingClasses: string[] = [];

  constructor() {
  }

  ngOnInit(): void {
    this.getStarClass();
  }

  getStarClass(){
    switch (this.ratingValue) {
      case 0: {
        this.ratingClasses = ['fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 0.5: {
        this.ratingClasses = ['fas fa-star-half-alt fill', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 1: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 1.5: {
        this.ratingClasses = ['fa fa-star fill', 'fas fa-star-half-alt fill', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 2: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 2.5: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fas fa-star-half-alt fill', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 3: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
      case 3.5: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fas fa-star-half-alt fill', 'fa fa-star outline'];
        break;
      }
      case 4: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star outline'];
        break;
      }
      case 4.5: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fas fa-star-half-alt fill'];
        break;
      }
      case 5: {
        this.ratingClasses = ['fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill', 'fa fa-star fill'];
        break;
      }
      default: {
        this.ratingClasses = ['fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline', 'fa fa-star outline'];
        break;
      }
    }
  }

}
