import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../../interfaces/product';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() product: Product;

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onAddToCart(event: MouseEvent) {
    event.stopPropagation();
    console.log('Add to Cart');
  }

  onNavigate(slug: string) {
    this.router.navigate(['product-details', slug] );
  }
}
