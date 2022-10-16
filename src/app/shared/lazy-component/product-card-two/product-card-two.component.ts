import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-product-card-two',
  templateUrl: './product-card-two.component.html',
  styleUrls: ['./product-card-two.component.scss']
})
export class ProductCardTwoComponent implements OnInit {

  @Input() data: any = null;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.data);
  }


}
