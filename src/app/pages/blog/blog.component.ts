import { Component, OnInit } from '@angular/core';
import {BlogService} from '../../services/blog.service';
import {Blog} from '../../interfaces/blog';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  allBlogs: Blog[] = [];

  constructor(
    private blogService: BlogService,
  ) { }

  ngOnInit(): void {
    this.getAllBlogs();
  }

  /**
   * HTTP REQ HANDLE
   */

  private getAllBlogs() {
    this.blogService.getAllBlogs()
      .subscribe(res => {
        this.allBlogs = res.data;
      }, error => {
        console.log(error);
      });
  }

}
