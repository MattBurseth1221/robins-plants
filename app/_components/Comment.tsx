import { removeMilliseconds } from "../_utils/helper-functions";
import { CommentType } from "./PostContainer";


export default function Comment(comment: CommentType) {
  return (
    <div className="mt-2">
      <div className="flex justify-between">
        <p className="text-left opacity-50 text-xs">{comment.username}</p>
        <p className="text-right opacity-50 text-xs min-w-[25%]">
          {removeMilliseconds(new Date(comment.create_date))}
        </p>
      </div>

      <p className="text-left break-words line-clamp-3">{comment.body}</p>
    </div>
  );
}
