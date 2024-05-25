import { useState } from "react";
import { PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

export default function Post({ postInfo }: any) {
  const [post, setPost] = useState<PostType>(postInfo);

  return (
    <div className="border-black border-2 bg-slate-100 mb-8 rounded-md text-center p-4">
      <Image
        src={
          "https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg"
        }
        width="600"
        height="800"
        alt="Flower?"
        className="rounded-md"
      />

      <div className="min-h-16 mt-2">
        <h1 className="mb-4 text-xl">{ post.title }</h1>
        <p className="text-left">{ post.body }</p>
      </div>
    </div>
  );
}
