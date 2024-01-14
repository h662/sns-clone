import { IComment } from "@/types";
import { Dispatch, FC, FormEvent, SetStateAction, useState } from "react";

import CreateCommentForm from "./CreateCommentForm";
import { useSession } from "next-auth/react";
import axios from "axios";
import CommentCardData from "./CommentCardData";

interface CommentCardProps {
  comment: IComment;
  comments: IComment[];
  setComments: Dispatch<SetStateAction<IComment[]>>;
}

const CommentCard: FC<CommentCardProps> = ({
  comment,
  comments,
  setComments,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");

  const { data: session } = useSession();

  const onSubmitComment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content || !session) return;

      const response = await axios.post<IComment>(
        `http://${window.location.host}/api/nestedComment/${comment.id}`,
        {
          content,
        }
      );

      const temp = comments.map((v) => {
        if (v.id === comment.id) {
          comment.nestedComments.push(response.data);
        }

        return v;
      });

      setComments(temp);
      setContent("");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <button
        className="w-full flex justify-between mb-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CommentCardData comment={comment} />
      </button>
      {isOpen && (
        <div className="mb-2 ml-4">
          <CreateCommentForm
            onSubmitComment={onSubmitComment}
            content={content}
            setContent={setContent}
            session={session}
          />
        </div>
      )}
      {comment.nestedComments?.map((v, i) => (
        <div key={i} className="flex justify-between ml-2 mb-1">
          <CommentCardData key={i} comment={v} />
        </div>
      ))}
    </>
  );
};

export default CommentCard;
