"use client";

import { UUID } from "crypto";
import { useEffect, useState } from "react";

import Post from "../_components/Post"

export interface PostType {
  post_id: UUID;
  title: string;
  body: string;
  image_ref: string | null;
  create_date: Date;
};

export default function PostContainer() {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    async function getPosts() {
      const postArray = await fetch(process.env.URL + "/api/posts?limit=2", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => data.result)
        .catch((e) => {
          console.log(e);
        });
      //console.log(postArray);

      setPosts(postArray);
    }

    getPosts();
  }, []);

  return posts ? (
    <div className="w-[800px] bg-gray-300 flex flex-col items-center pt-8">
      {posts.map((post: PostType, index) => {
        return (
          <Post key={index} postInfo={post} />
        );
      })}
    </div>
  ) : (
    <div className="w-[100%] bg-gray-300">
      <div>No posts found. Try again later.</div>
    </div>
  );
}