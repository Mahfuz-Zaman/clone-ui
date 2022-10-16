import {Component, Input, OnInit} from '@angular/core';
import {ProductCategory} from '../../../interfaces/product-category';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() data: ProductCategory;

  constructor() { }

  ngOnInit(): void {
  }

}
