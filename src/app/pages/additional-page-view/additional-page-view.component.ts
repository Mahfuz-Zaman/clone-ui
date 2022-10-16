import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomizationService} from '../../services/customization.service';

@Component({
  selector: 'app-extra-page-view',
  templateUrl: './additional-page-view.component.html',
  styleUrls: ['./additional-page-view.component.scss']
})
export class AdditionalPageViewComponent implements OnInit {

  slug: string = null;
  pageInfo: any = '';
  msg = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private customizationService: CustomizationService,
  ) {
  }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.slug = param.get('pageSlug');
      this.getPageInfo();
    });

  }


  private getPageInfo() {
    this.customizationService.getPageInfoBySlug(this.slug)
      .subscribe(res => {
        this.pageInfo = res.data;
        if (!this.pageInfo) {
          this.msg = '<h2>Coming Soon!</h2>'
        }
        // console.log(this.pageInfo);
      }, error => {
        console.log(error);
      });
  }


}
