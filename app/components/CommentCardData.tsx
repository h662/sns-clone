import { IComment } from "@/types";
import { FC } from "react";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";

interface CommentCardDataProps {
  comment: IComment;
}

const CommentCardData: FC<CommentCardDataProps> = ({ comment }) => {
  return (
    <>
      <div>
        <span>{comment.content}</span>
      </div>
      <div>
        <span className="font-semibold">{comment.user.name}</span>
        <span className="ml-1">
          #{comment.user.id.substring(comment.user.id.length - 4)}
        </span>
        <span className="ml-2">
          {formatDistanceToNow(new Date(comment.createdAt), {
            locale: ko,
            addSuffix: true,
          })}
        </span>
      </div>
    </>
  );
};

export default CommentCardData;
