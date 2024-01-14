import { IPost } from "@/types";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FiHeart, FiMessageSquare } from "react-icons/fi";

interface PostCardProps {
  post: IPost;
}

const PostCard: FC<PostCardProps> = ({ post }) => {
  const [image, setImage] = useState<string>("");

  const getImage = async (imageFileName: string) => {
    try {
      const imageResponse = await axios.get(
        `http://${window.location.host}/api/post/image?imageFileName=${imageFileName}`
      );

      setImage(imageResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!post.image) return;

    getImage(post.image);
  }, [post]);

  return (
    <Link href={`/${post.id}`}>
      <div className="card-style flex justify-between">
        <div>
          <div className="truncate">
            <span className="font-semibold">{post.user.name}</span> #
            {post.user.id.substring(post.user.id.length - 4)}
          </div>
          {image && (
            <div className="image-style">
              <Image
                className="object-cover"
                src={image}
                alt={post.content || ""}
                fill
              />
            </div>
          )}
          <div className="mt-1 truncate">{post.content}</div>
        </div>
        <div className="flex flex-col justify-between">
          <div className="self-end">
            {formatDistanceToNow(new Date(post.createdAt), {
              locale: ko,
              addSuffix: true,
            })}
          </div>
          <div className="flex gap-2">
            {post.comments && (
              <div className="flex items-center gap-1">
                <FiMessageSquare /> {post.comments.length}
              </div>
            )}
            <div className="flex items-center gap-1">
              <FiHeart /> {post.likes.length}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
