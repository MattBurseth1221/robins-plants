import { useContext } from "react";
import { removeMilliseconds } from "../_utils/helper-functions";
import CommentMenu from "./CommentMenu";
import { CommentType } from "./PostContainer";
import { UserContext } from "../_providers/UserProvider";


export default function Comment(comment: CommentType) {
  const user = useContext(UserContext);

  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <div className="flex items-center">
          <p className="text-left opacity-50 text-xs mr-2">{comment.username}</p>
          {user!.username === comment.username && <CommentMenu />}
        </div>
        
        <p className="text-right opacity-50 text-xs min-w-[25%]">
          {removeMilliseconds(new Date(comment.create_date))}
        </p>
      </div>

      <p className="text-left break-words line-clamp-3">{comment.body}</p>
    </div>
  );
}
