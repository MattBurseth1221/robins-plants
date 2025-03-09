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
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">Delete post?</DialogTitle>
          <Description>
            This will (semi) permanently delete the post.
          </Description>
          <p>
            Are you sure you want to delete this post? It will be a pain in the
            ass to put it back up again...
          </p>
          <div className="flex gap-4">
            <button
              className="hover:bg-slate-300 rounded-md p-2 transition duration-150"
              onClick={() => handleDeletePost()}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400 hover:text-black transition duration-150"
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
