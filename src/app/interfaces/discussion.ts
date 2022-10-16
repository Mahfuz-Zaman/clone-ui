import {User} from './user';
import {Product} from './product';

export interface DiscussionReply {
  _id?: string;
  replyDate: Date;
  user?: string | User;
  isAdmin: boolean;
  name: string;
  email?: string;
  profileImage: string;
  comment: string;
  status: boolean;
  vote: number;
  reply?: any[];
}

export interface Discussion {
  _id?: string;
  user?: string | User;
  product?: string | Product;
  discussionDate: Date;
  name: string;
  email?: string;
  profileImage: string;
  comment: string;
  status: boolean;
  reply?: DiscussionReply[];
}
