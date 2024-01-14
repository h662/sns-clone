"use client";

import { NextPage } from "next";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Post } from "@prisma/client";
import Image from "next/image";

const Create: NextPage = () => {
  const [content, setContent] = useState<string>("");
  const [post, setPost] = useState<Post>();
  const [image, setImage] = useState<string>();
  const { data: session } = useSession();
  const router = useRouter();

  const onSubmitPost = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!content) return;

      await axios.post(`http://${window.location.host}/api/post`, {
        content,
        postId: post?.id,
      });

      router.replace("/");
    } catch (error) {
      console.error(error);
    }
  };

  const onUploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files) return;

      const formData = new FormData();

      formData.append("imageFile", e.target.files[0]);

      const postResponse = await axios.post<Post>(
        `http://${window.location.host}/api/post/image`,
        formData
      );

      setPost(postResponse.data);

      const imageResponse = await axios.get(
        `http://${window.location.host}/api/post/image?imageFileName=${postResponse.data.image}`
      );

      setImage(imageResponse.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!session) {
      router.replace("/");
    }
  }, [session]);

  return (
    <div className="grow flex flex-col justify-center items-center">
      <form className="w-full grow p-4 flex flex-col" onSubmit={onSubmitPost}>
        <textarea
          className="input-style w-full grow border-2 pt-2 resize-none"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {image && (
          <div className="image-style">
            <Image className="object-cover" src={image} alt="preview" fill />
          </div>
        )}
        <div className="mt-2 self-end">
          <label className="btn-style" htmlFor="uploadImage">
            Image
          </label>
          <input
            id="uploadImage"
            className="hidden"
            type="file"
            accept="image/*"
            onChange={onUploadImage}
          />
          <input className="btn-style ml-2" type="submit" value="Create" />
        </div>
      </form>
    </div>
  );
};

export default Create;
