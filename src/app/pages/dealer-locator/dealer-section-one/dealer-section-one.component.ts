import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-dealer-section-one',
  templateUrl: './dealer-section-one.component.html',
  styleUrls: ['./dealer-section-one.component.scss']
})
export class DealerSectionOneComponent implements OnInit {

  constructor(
    public router: Router,
  ) { }

  ngOnInit(): void {
  }

}
