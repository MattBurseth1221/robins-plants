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
    <div className="border-black border-2">
      <Image src="" alt="Flower?"/>
      {post.title}
    </div>
  );
}
