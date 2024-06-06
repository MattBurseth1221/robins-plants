import { useState } from "react";
import { PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

export default function Post({ postInfo }: any) {
  const [post, setPost] = useState<PostType>(postInfo);

  return post ? (
    <div className="border-black border-2 bg-slate-100 mb-8 rounded-md text-center p-8 justify-center w-[100%]">
      <Image
        src={`https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${post.image_ref}` || ""}
        width="900"
        height="0"
        alt="Flower?"
        className="rounded-md mx-auto"
      />

      <div className="min-h-16 mt-2">
        <div className="flex flex-row justify-between border-b-[1px] border-slate-500 border-opacity-20">
          <h1 className="text-left text-xl max-w-[50%]">{post.title}</h1>
          <p className="max-w-[50%] text-right">
            {new Date(post.create_date).toLocaleString()}
          </p>
        </div>

        <p className="text-left mt-4">{post.body}</p>
      </div>
    </div>
  ) : (<div>Loading post...</div>);
}
