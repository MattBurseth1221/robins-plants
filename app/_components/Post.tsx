import { useState } from "react";
import { PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

export default function Post({ postInfo }: any) {
  const [post, setPost] = useState<PostType>(postInfo);

  return (
    <div className="border-black border-2 bg-slate-100 w-[75%] mb-8 rounded-md text-center">
      <Image src={"https://hips.hearstapps.com/hmg-prod/images/close-up-of-blossoming-rose-flower-royalty-free-image-1580853844.jpg"} width="600" height="800" alt="Flower?"/>

      <h1>
        {post.title}
      </h1>
      
    </div>
  );
}
