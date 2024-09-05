import { useContext, useState } from "react";
import { formatDate, userIsAdmin } from "../_utils/helper-functions";
import CommentMenu from "./CommentMenu";
import { CommentType } from "./PostContainer";
import { UserContext } from "../_providers/UserProvider";

export default function Comment(comment: CommentType) {
  const user = useContext(UserContext);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <p className="text-left opacity-50 text-xs mr-1">{comment.username}</p>
          {comment.been_edited && <p className="opacity-50 text-xs">● Edited</p>}
          {(user!.username === comment.username || userIsAdmin(user)) && <CommentMenu comment={comment} /> }
        </div>
        
        <p className="text-right opacity-50 text-xs min-w-[25%]">
          {formatDate(new Date(comment.create_date))}
        </p>
      </div>

      <p className="text-left break-words line-clamp-3">{comment.body}</p>
    </div>
  );
}
