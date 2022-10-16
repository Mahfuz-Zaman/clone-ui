import {Component, Inject, Input, OnInit} from '@angular/core';
import {Product} from '../../../../interfaces/product';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-product-view-table-one',
  templateUrl: './product-view-table-one.component.html',
  styleUrls: ['./product-view-table-one.component.scss']
})
export class ProductViewTableOneComponent implements OnInit {

  @Input() products: Product[];
  @Input() needAction = false;

  constructor(
    public dialogRef: MatDialogRef<ProductViewTableOneComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.products = this.data;
      // console.log(this.data);
    }
  }

}
