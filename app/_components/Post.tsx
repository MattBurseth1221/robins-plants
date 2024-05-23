import { useState } from "react";
import { PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

// interface PostType {
//   post_id: UUID;
//   title: string;
//   body: string;
//   image_ref: string | null;
//   create_date: Date;
// };

export default function Post({ postInfo }: any) {
  const [post, setPost] = useState<PostType>(postInfo);

  return (
    <div className="border-black border-2 bg-slate-100 w-[75%] mb-8 rounded-md text-center">
      <Image src={""} width="600" height="800" alt="Flower?"/>

      <h1>
        {post.title}
      </h1>
      
    </div>
  );
}