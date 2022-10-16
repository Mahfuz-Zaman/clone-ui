import {Component, Input, OnInit} from '@angular/core';
import {DealOnPlay} from '../../../interfaces/deal-on-play';

@Component({
  selector: 'app-offer-card',
  templateUrl: './offer-card.component.html',
  styleUrls: ['./offer-card.component.scss']
})
export class OfferCardComponent implements OnInit {

  @Input() data: DealOnPlay;

  constructor() { }

  ngOnInit(): void {
  }

}
