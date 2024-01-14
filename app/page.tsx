"use client";

import axios from "axios";
import { NextPage } from "next";
import { useEffect, useRef, useState } from "react";
import PostCard from "./components/PostCard";
import { IPost } from "@/types";

const Home: NextPage = () => {
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<IPost[]>([]);

  const infiniteScrollRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver>();

  const getPosts = async () => {
    try {
      const response = await axios.get<IPost[]>(
        `http://${window.location.host}/api/post?page=${page}`
      );

      if (response.data.length === 0) return;

      setPage(page + 1);
      setPosts([...posts, ...response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        getPosts();
      }
    });

    if (!infiniteScrollRef.current) return;

    observer.current.observe(infiniteScrollRef.current);

    return () => observer.current?.disconnect();
  });

  return (
    <div className="grow flex flex-col items-center">
      <div className="w-full p-4 flex flex-col gap-4">
        {posts.map((v, i) => (
          <PostCard key={i} post={v} />
        ))}
      </div>
      <div className="w-full text-white" ref={infiniteScrollRef}>
        infinite scroll
      </div>
    </div>
  );
};

export default Home;
