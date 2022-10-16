import { Component, OnInit } from '@angular/core';
import {CareerEsquire} from '../../../interfaces/career-esquire';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CareerEsquireService} from '../../../services/career-esquire.service';

@Component({
  selector: 'app-career-esquire-details',
  templateUrl: './career-esquire-details.component.html',
  styleUrls: ['./career-esquire-details.component.scss']
})
export class CareerEsquireDetailsComponent implements OnInit {


  careerEsquireSlug: string = null;
  careerEsquire: CareerEsquire;

  constructor(
    private careerEsquireService: CareerEsquireService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.careerEsquireSlug = param.get('slug');
      this.getSingleCareerEsquireBySlug();
    });
  }

  /**
   * HTTP REQ HANDLE
   */

  private getSingleCareerEsquireBySlug() {
    this.spinner.show();
    this.careerEsquireService.getSingleCareerEsquireBySlug(this.careerEsquireSlug)
      .subscribe(res => {
        this.careerEsquire = res.data;
        // console.log(res.data);
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }

}
