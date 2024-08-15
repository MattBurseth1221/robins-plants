"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PostContext } from "../_providers/PostProvider";
import { useContext } from "react";
import { CommentType } from "./PostContainer";

type DeleteDialogProps = {
  comment: CommentType;
  showDeleteCommentModal: boolean;
  setShowDeleteCommentModal: Function;
};

export default function DeleteDialog({
  comment,
  showDeleteCommentModal,
  setShowDeleteCommentModal,
}: DeleteDialogProps) {
  const post = useContext(PostContext);

  //Filters the current posts' comments array and removes the one that matches the current comment UUID
  function deleteCommentFromArray() {
    post!.comments = post?.comments.filter((tempComment) => comment.comment_id !== tempComment.comment_id)!;
  }

  //Calls the delete post endpoint, toggles confirm delete modal
  async function deleteComment() {
    const response = await fetch(`/api/comments?id=${comment.comment_id}`, {
      method: "DELETE",
    }).then((res) => res.json());

    if (response.success) {
      console.log(response.success);
      deleteCommentFromArray();
    } else {
      console.log(response.error);
      alert("Something went wrong.");
    }

    setShowDeleteCommentModal(false);
  }

  return (
    <Dialog
      open={showDeleteCommentModal}
      onClose={() => setShowDeleteCommentModal(!showDeleteCommentModal)}
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">Delete post?</DialogTitle>
          <Description>
            This will (semi) permanently delete the comment.
          </Description>
          <p>
            Are you sure you want to delete this comment? It will be a pain in the
            ass to put it back up again...
          </p>
          <div className="flex gap-4">
            <button
              className="hover:bg-slate-300 rounded-md p-2 transition duration-150"
              onClick={() => setShowDeleteCommentModal(!showDeleteCommentModal)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400 hover:text-black transition duration-150"
              onClick={() => {
                deleteComment();
              }}
            >
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
