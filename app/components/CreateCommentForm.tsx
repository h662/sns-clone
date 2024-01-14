import { Session } from "next-auth";
import { Dispatch, FC, FormEvent, SetStateAction } from "react";

interface CreateCommentFormProps {
  onSubmitComment: (e: FormEvent) => Promise<void>;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  session: Session | null;
}

const CreateCommentForm: FC<CreateCommentFormProps> = ({
  onSubmitComment,
  content,
  setContent,
  session,
}) => {
  return (
    <form className="w-full grow flex flex-col mt-2" onSubmit={onSubmitComment}>
      <textarea
        className="input-style w-full grow border-2 pt-2 h-20 resize-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          session
            ? "Write comment"
            : "'Write comment' will be available after sign in."
        }
        disabled={!session}
      />
      <input
        className={`btn-style w-fit self-end mt-2 ${
          !session && "text-gray-200 border-gray-200"
        }`}
        type="submit"
        value="Create"
        disabled={!session}
      />
    </form>
  );
};

export default CreateCommentForm;
