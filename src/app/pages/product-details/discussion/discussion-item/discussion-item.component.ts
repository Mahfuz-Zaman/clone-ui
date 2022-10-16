import {Component, Input, OnInit} from '@angular/core';
import {Discussion} from '../../../../interfaces/discussion';
import {DiscussionService} from '../../../../services/discussion.service';
import {UiService} from '../../../../services/ui.service';
import {User} from '../../../../interfaces/user';
import {ReloadService} from '../../../../services/reload.service';

@Component({
  selector: 'app-discussion-item',
  templateUrl: './discussion-item.component.html',
  styleUrls: ['./discussion-item.component.scss']
})
export class DiscussionItemComponent implements OnInit {
  @Input() user: User;
  @Input() discussion: Discussion;

  isVisibleReply1Form = false;

  constructor(
    private discussionService: DiscussionService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {
  }

  onSubmitReply1(event: any) {
    const mReply = {
      _id: this.discussion._id,
      reply: {
        ...event,
        ...{
          status: false,
          replyDate: new Date(),
          isAdmin: false,
          vote: 0,
          reply: []
        }
      }
    };
    this.addDiscussionReplyLv1(mReply);
  }



  /**
   * HTTP REQ
   */

  private addDiscussionReplyLv1(data: any) {
    this.discussionService.addDiscussionReplyLv1(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshDiscussion$();
      }, error => {
        this.uiService.wrong('Something went wrong!');
        console.log(error);
      });
  }

}
