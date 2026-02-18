"use client";

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { PostContext } from "../_providers/PostProvider";
import { useContext } from "react";
import Image from "next/image";
import PostPhotoContainer from "./PostPhotoContainer";

type UpdateDialogProps = {
  editingPost: boolean;
  setEditingPost: Function;
  currentImageIndex: number;
  handleImageIndexChange: Function;
};

export default function UpdateDialog({
  editingPost,
  setEditingPost,
  currentImageIndex,
  handleImageIndexChange,
}: UpdateDialogProps) {
  const post = useContext(PostContext);

  const PostPhotoContainerProps = {
    images: post!.image_refs,
    handleImageIndexChange,
    currentImageIndex,
  };

  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
      console.log("refreshed.");
    }, 100);
  }

  //Takes the form data from the edit post modal and send it to post put endpoint
  async function updatePost(formData: FormData) {
    const files = formData.getAll("files") as File[];

    if (formData.getAll("files").length > 10) {
      alert("Maximum of 10 images allowed.");
      return;
    }

    const maxUploadSize = 500 * 1024 * 1024;
    for (let file of files) {
      file = file as File;
      if (file.size > maxUploadSize) {
        alert("File size of 500MB exceeded.");
        return;
      }
    }

    const title = formData.get("title");
    const body = formData.get("body");

    if (
      title === post!.title &&
      body === post!.body &&
      (files === null || files.length === 0)
    ) {
      alert("No changes detected.");

      //Do we want to close the modal if no changes were detected?
      return;
    }

    //Append file image references array to remove any photos that aren't the same file
    formData.append("image_refs", post!.image_refs.toString());

    try {
      const response = await fetch(`/api/posts?id=${post!.post_id}`, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());

      if (response.success) {
        console.log(response.success);
      } else {
        console.log(response.error);
        alert("Something went wrong.");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setEditingPost(false);
    }

    console.log("refreshing page...");

    //Figure this out later
    refreshPage();
  }

  return (
    <Dialog
      open={editingPost}
      onClose={() => setEditingPost(!editingPost)}
      className="fixed inset-0 z-50"
    >
      {/* Dimmed background overlay */}
      {editingPost && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
        <DialogPanel className="max-w-lg space-y-4 border border-border bg-surface p-12 rounded-xl shadow-2xl relative z-50">
          <DialogTitle className="font-bold text-text text-2xl">
            Update Post
          </DialogTitle>
          <Description className="text-muted">
            This will edit the post.
          </Description>
          
          <form action={updatePost} id="edit-form">
            {post?.image_refs.length !== 0 && (
              <PostPhotoContainer {...PostPhotoContainerProps} />
            )}
            <label className="block mt-4">
              <span className="text-muted">Upload a Photo</span>
              <input
                type="file"
                name="files"
                accept="image/jpeg,video/*,image/png"
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 file:rounded-full file:shadow-md file:bg-primary file:border-0 file:text-white file:text-sm file:py-2 file:px-4 file:font-sans hover:file:bg-primaryDark cursor-pointer transition-all duration-300"
                multiple
              />
            </label>
            <label>
              <span className="text-muted">Title</span>
              <input
                defaultValue={post!.title}
                type="text"
                name="title"
                maxLength={200}
                required
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
              />
            </label>
            <label>
              <span className="text-muted">Body</span>
              <textarea
                defaultValue={post!.body}
                name="body"
                rows={5}
                required
                className="w-full mt-1 p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
              />
            </label>
          </form>

          <div className="flex gap-4">
            <button
              className="hover:bg-muted/20 text-muted rounded-md p-2 transition duration-150"
              onClick={() => setEditingPost(!editingPost)}
            >
              Cancel
            </button>
            <button
              className="bg-primary text-white p-2 rounded-md hover:bg-primaryDark hover:text-white transition duration-150"
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
