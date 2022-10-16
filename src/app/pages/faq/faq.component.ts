import {Component, OnDestroy, OnInit} from '@angular/core';
import {Faq} from '../../interfaces/faq';
import {Subscription} from 'rxjs';
import {NgxSpinnerService} from 'ngx-spinner';
import {FaqService} from '../../services/faq.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FAQComponent implements OnInit, OnDestroy {

  // Subscriptions
  private subDataOne: Subscription;

  allFaqs: Faq[] = [];

  constructor(
    private spinner: NgxSpinnerService,
    private faqService: FaqService,
  ) { }

  ngOnInit(): void {
    this.getAllFaq();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllFaq() {
    this.subDataOne = this.faqService.getAllFaq()
      .subscribe(res => {
        this.allFaqs = res.data;
      }, error => {
        console.log(error);
      });
  }

  ngOnDestroy() {
    if (this.subDataOne) {
      this.subDataOne.unsubscribe();
    }
  }

}
