import {Component, Input, OnInit} from '@angular/core';
import {DiscussionReply} from '../../../../interfaces/discussion';
import {DiscussionService} from '../../../../services/discussion.service';
import {UiService} from '../../../../services/ui.service';
import {User} from '../../../../interfaces/user';
import {ReloadService} from '../../../../services/reload.service';

@Component({
  selector: 'app-discussion-reply-item',
  templateUrl: './discussion-reply-item.component.html',
  styleUrls: ['./discussion-reply-item.component.scss']
})
export class DiscussionReplyItemComponent implements OnInit {

  @Input() user: User;
  @Input() discussionId: string;
  @Input() discussionReply: DiscussionReply;

  isVisibleReply2Form = false;

  constructor(
    private discussionService: DiscussionService,
    private uiService: UiService,
    private reloadService: ReloadService,
  ) { }

  ngOnInit(): void {
  }

  onSubmitReply2(event: any) {
    const mReply = {
      _id: this.discussionId,
      replyId: this.discussionReply._id,
      reply: {
        ...event,
        ...{
          status: false,
          replyDate: new Date(),
          isAdmin: false,
          vote: 0
        }
      }
    };
    this.addDiscussionReplyLv1(mReply);
    // console.log(mReply);
  }

  /**
   * HTTP REQ
   */

  private addDiscussionReplyLv1(data: any) {
    this.discussionService.addDiscussionReplyLv2(data)
      .subscribe(res => {
        this.uiService.success(res.message);
        this.reloadService.needRefreshDiscussion$();
      }, error => {
        this.uiService.wrong('Something went wrong!');
        console.log(error);
      });
  }

}
