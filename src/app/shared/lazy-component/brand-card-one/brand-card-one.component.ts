import {Component, Input, OnInit} from '@angular/core';
import {Brand} from '../../../interfaces/brand';

@Component({
  selector: 'app-brand-card-one',
  templateUrl: './brand-card-one.component.html',
  styleUrls: ['./brand-card-one.component.scss']
})
export class BrandCardOneComponent implements OnInit {

  @Input() data: Brand = null;
  constructor() {
  }

  ngOnInit(): void {
  }

}
