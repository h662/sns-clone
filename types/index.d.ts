import { Comment, Like, Post, User } from "@prisma/client";

export interface IPost extends Post {
  user: User;
  comments: Comment[];
  likes: Like[];
}

export interface IComment extends Comment {
  user: User;
  post: Post;
  nestedComments: IComment[];
}
