"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { CommentType } from "./PostContainer";
import { useContext } from "react";
import { CommentContext, CommentContextType } from "./Post";

type UpdateDialogProps = {
  comment: CommentType;
  showUpdateCommentModal: boolean;
  setShowUpdateCommentModal: Function;
};

export default function UpdateCommentDialog({
  comment,
  showUpdateCommentModal,
  setShowUpdateCommentModal,
}: UpdateDialogProps) {
  const {comments, setComments}: CommentContextType = useContext(CommentContext);

  //Takes the form data from the edit comment modal and send it to comment put endpoint
  async function updateComment(formData: FormData) {
    const body = (formData.get("comment-body") as string).trim();

    if (!body || body.trim().length === 0) {
        alert("Body cannot be empty.");
        return;
    }

    if (comment.body === body) {
      alert("No changes detected.");
      return;
    }

    try {
      console.log("changing comment...");
      const response = await fetch(`/api/comments?id=${comment.comment_id}`, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());
      console.log("changed comment");

      console.log(response);
      console.log(response.error);

      if (response.success) {
        let oldComments = comments as CommentType[];

        for (let i = 0; i < oldComments.length; i++) {
          if (oldComments[i].comment_id == comment.comment_id) {
            oldComments[i].body = body;
            oldComments[i].been_edited = true;
            break;
          }
        }
        
        setComments([...oldComments]);
      } else {
        console.log(response.error);
        alert("Something went wrong.");
      }
    } catch (e) {
      console.log(e);
      return;
    } finally {
      setShowUpdateCommentModal(false);
    }
  }

  return (
    <Dialog
      open={showUpdateCommentModal}
      onClose={() => setShowUpdateCommentModal(!showUpdateCommentModal)}
      transition 
      className="fixed inset-0 transition duration-[500] ease-out data-[closed]:scale-95 data-[closed]:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 max-h-[50vh] my-auto">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">Update Comment</DialogTitle>
          <Description>This will edit the comment.</Description>
          <form action={updateComment} id="edit-form">
            <label>
              <span>Comment Body</span>
              <textarea
                defaultValue={comment.body}
                name="comment-body"
                rows={5}
                className="w-[100%]"
                required
              />
            </label>
          </form>

          <div className="flex gap-4">
            <button
              className="hover:bg-slate-300 rounded-md p-2 transition duration-150"
              onClick={() => setShowUpdateCommentModal(!showUpdateCommentModal)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400 hover:text-black transition duration-150"
              type="submit"
              form="edit-form"
            >
              Update
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
