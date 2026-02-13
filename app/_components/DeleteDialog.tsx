"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PostContext } from "../_providers/PostProvider";
import { useContext } from "react";

type DeleteDialogProps = {
  deletePostFromArray: Function;
  confirmDeletePost: boolean;
  setConfirmDeletePost: Function;
};

export default function DeleteDialog({
  deletePostFromArray,
  confirmDeletePost,
  setConfirmDeletePost,
}: DeleteDialogProps) {
  const post = useContext(PostContext);

  //Calls the delete post endpoint, toggles confirm delete modal
  async function deletePost() {
    const response = await fetch(`/api/posts?id=${post!.post_id}`, {
      method: "DELETE",
      body: JSON.stringify({ files: post!.image_refs }),
    }).then((res) => res.json());

    if (response.success) {
      console.log(response.success);
      deletePostFromArray(post!.post_id);
    } else {
      console.log(response.error);
      alert("Something went wrong.");
    }

    setConfirmDeletePost(false);
  }

  //Toggles the confirm delete modal and selects the current
  function handleDeletePost() {
    setConfirmDeletePost(!confirmDeletePost);
  }

  return (
    <Dialog
      open={confirmDeletePost}
      onClose={() => handleDeletePost()}
      className="fixed inset-0 z-50"
    >
      {/* Dimmed background overlay */}
      {confirmDeletePost && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity" aria-hidden="true" />
      )}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
        <DialogPanel className="max-w-lg space-y-4 border border-border bg-surface p-12 rounded-xl shadow-2xl relative z-50">
          <DialogTitle className="font-bold text-text">Delete post?</DialogTitle>
          <Description className="text-muted">
            This will (semi) permanently delete the post.
          </Description>
          <p className="text-text">
            Are you sure you want to delete this post?
          </p>
          <div className="flex gap-4">
            <button
              className="hover:bg-muted/20 text-muted rounded-md p-2 transition duration-150"
              onClick={() => handleDeletePost()}
            >
              Cancel
            </button>
            <button
              className="bg-error text-white p-2 rounded-md hover:bg-error/80 hover:text-white transition duration-150"
              onClick={() => {
                deletePost();
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
