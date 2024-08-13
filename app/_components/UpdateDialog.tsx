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

  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
      console.log("refreshed.");
    }, 100);
  }

  //Takes the form data from the edit post modal and send it to post put endpoint
  async function updatePost(formData: FormData) {
    if (formData.getAll("files").length > 10) {
      alert("Maximum of 10 images allowed.");
      return;
    }

    const title = formData.get("title");
    const body = formData.get("body");
    const files = formData.getAll("files") as File[];

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
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4 max-h-[50vh] my-auto">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md">
          <DialogTitle className="font-bold">Update Post</DialogTitle>
          <Description>This will edit the post.</Description>

          {post!.image_refs!.length !== 1 && (
            <button
              onClick={() => {
                handleImageIndexChange(1);
              }}
            >
              Change
            </button>
          )}
          <form action={updatePost} id="edit-form">
            <Image
              src={
                `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                  post!.image_refs![currentImageIndex]
                }` || ""
              }
              width="400"
              height="0"
              alt="Flower?"
              className="rounded-md mx-auto mb-4"
            />
            <label>
              <span>Upload a Photo (JPG only I think)</span>
              <input type="file" name="files" accept="image/*" multiple />
            </label>
            <label>
              <span>Title</span>
              <input
                defaultValue={post!.title}
                type="text"
                name="title"
                maxLength={200}
                required
              />
            </label>
            <label>
              <span>Body</span>
              <textarea
                defaultValue={post!.body}
                name="body"
                rows={5}
                className="w-[100%]"
                required
              />
            </label>
          </form>

          <div className="flex gap-4">
            <button
              className="hover:bg-slate-300 rounded-md p-2 transition duration-150"
              onClick={() => setEditingPost(!editingPost)}
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
