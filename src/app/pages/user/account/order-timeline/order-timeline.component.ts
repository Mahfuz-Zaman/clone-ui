import { Component, Input, OnInit } from '@angular/core';
import { OrderTimeline } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-timeline',
  templateUrl: './order-timeline.component.html',
  styleUrls: ['./order-timeline.component.scss']
})
export class OrderTimelineComponent implements OnInit {

  @Input() orderTimeline: OrderTimeline = null;

  constructor() { }

  ngOnInit(): void {
  }

}
