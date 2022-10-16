import { Component, OnInit } from '@angular/core';
import {CareerEsquire} from '../../interfaces/career-esquire';
import {CareerEsquireService} from '../../services/career-esquire.service';

@Component({
  selector: 'app-career-esquire',
  templateUrl: './career-esquire.component.html',
  styleUrls: ['./career-esquire.component.scss']
})
export class CareerEsquireComponent implements OnInit {

  allCareerEsquire: CareerEsquire[] = [];

  constructor(
    private careerEsquireService: CareerEsquireService
  ) { }

  ngOnInit(): void {
    this.getAllCareerEsquire();
  }
  /**
   * HTTP REQ HANDLE
   */

  private getAllCareerEsquire() {
    this.careerEsquireService.getAllCareerEsquire()
      .subscribe(res => {
        this.allCareerEsquire = res.data;
      }, error => {
        console.log(error);
      });
  }

}
