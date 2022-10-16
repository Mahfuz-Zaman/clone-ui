import {Component, Input, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {UiService} from '../../../services/ui.service';
import {NewsletterService} from '../../../services/newsletter.service';
import {ShopInfo} from '../../../interfaces/shop-info';
import {FooterDataService} from '../../../services/footer-data.service';
import {FooterData} from '../../../interfaces/footer-data';
import {NgxSpinnerService} from 'ngx-spinner';
import {UtilsService} from '../../../services/utils.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() shopInfo: ShopInfo;

  footerData: FooterData;

  constructor(
    private newsletterService: NewsletterService,
    private uiService: UiService,
    private footerDataService: FooterDataService,
    private utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.getFooterData();
  }

  onSubmit(dataForm: NgForm) {
    if (dataForm.invalid) {
      this.uiService.warn('Please enter a valid email');
      return;
    }
    if (this.utilsService.validateEmail(dataForm.value.email)) {
      this.newsletterService.addNewsletter(dataForm.value)
        .subscribe(res => {
          this.uiService.success(res.message);
          dataForm.resetForm();
        }, error => {
          console.log(error);
        });
    } else{
      this.uiService.warn('Please insert valid email Address');
    }
  }

  private getFooterData() {
    this.footerDataService.getFooterData()
      .subscribe(res => {
        this.footerData = res.data;
      }, err => {
        console.log(err);
      });
  }

}
