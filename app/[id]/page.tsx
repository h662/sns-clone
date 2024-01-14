"use client";

import { IComment, IPost } from "@/types";
import axios from "axios";
import { NextPage } from "next";
import { useParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import PostCard from "../components/PostCard";
import CreateCommentForm from "../components/CreateCommentForm";
import CommentCard from "../components/CommentCard";

const Detail: NextPage = () => {
  const [post, setPost] = useState<IPost>();
  // comment content
  const [content, setContent] = useState<string>("");
  const [comments, setComments] = useState<IComment[]>([]);

  const { id } = useParams();

  const { data: session } = useSession();

  const getPost = async () => {
    try {
      const response = await axios.get<IPost>(
        `http://${window.location.host}/api/post/${id}`
      );

      setPost(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getComments = async () => {
    try {
      const response = await axios.get<IComment[]>(
        `http://${window.location.host}/api/comment?postId=${id}`
      );

      setComments([...comments, ...response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmitComment = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content || !session) return;

      const response = await axios.post<IComment>(
        `http://${window.location.host}/api/comment`,
        {
          content,
          postId: post?.id,
        }
      );

      setComments([response.data, ...comments]);
      setContent("");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPost();
    getComments();
  }, []);

  return (
    <div className="p-2">
      {post && <PostCard post={post} />}
      <CreateCommentForm
        onSubmitComment={onSubmitComment}
        content={content}
        setContent={setContent}
        session={session}
      />
      <div className="mt-2">
        {comments?.map((v, i) => (
          <CommentCard
            key={i}
            comment={v}
            comments={comments}
            setComments={setComments}
          />
        ))}
      </div>
    </div>
  );
};

export default Detail;
