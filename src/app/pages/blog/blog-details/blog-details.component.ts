import { Component, OnInit } from '@angular/core';
import {Blog} from '../../../interfaces/blog';
import {BlogService} from '../../../services/blog.service';
import {ActivatedRoute} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.scss']
})
export class BlogDetailsComponent implements OnInit {

  blogSlug: string = null;
  blog: Blog;

  constructor(
    private blogService: BlogService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,

  ) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(param => {
      this.blogSlug = param.get('slug');
      this.getSingleBlogBySlug();
    });

  }

  /**
   * HTTP REQ HANDLE
   */

  private getSingleBlogBySlug() {
    this.spinner.show();
    this.blogService.getSingleBlogBySlug(this.blogSlug)
      .subscribe(res => {
        this.blog = res.data;
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
        console.log(error);
      });
  }
}
