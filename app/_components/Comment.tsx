import { useContext, useState } from "react";
import { formatDate, userIsAdmin } from "../_utils/helper-functions";
import CommentMenu from "./CommentMenu";
import { CommentType } from "./PostContainer";
import { UserContext } from "../_providers/UserProvider";
import Link from "next/link";

export default function Comment(comment: CommentType) {
  const user = useContext(UserContext);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <Link href={`/profile/${comment.username}`} className="text-left text-muted text-xs mr-1 hover:text-primary transition-all">{comment.username}</Link>
          {comment.been_edited && <p className="text-muted text-xs">● Edited</p>}
          {(user!.username === comment.username || userIsAdmin(user)) && <CommentMenu comment={comment} /> }
        </div>
        
        <p className="text-right text-muted text-xs min-w-[25%]">
          {formatDate(new Date(comment.create_date))}
        </p>
      </div>

      <p className="text-left break-words line-clamp-3 text-text">{comment.body}</p>
    </div>
  );
}
