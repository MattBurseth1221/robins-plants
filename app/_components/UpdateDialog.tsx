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
      className="relative z-50"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md absolute">
          <DialogTitle className="font-bold">Update Post</DialogTitle>
          <Description>This will edit the post.</Description>

          {post!.image_refs!.length !== 1 && (
            <button
              onClick={() => {
                handleImageIndexChange(1);
              }}
              className="rounded-md border-2 hover:bg-slate-200 border-slate-300 transition p-2"
            >
              Change
            </button>
          )}
          <form action={updatePost} id="edit-form">
          {post!.image_refs![currentImageIndex].endsWith("-video") ? (
            <video width="200" className="rounded-md mx-auto border-2 border-black" controls><source src={
              `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                post!.image_refs![currentImageIndex]
              }` || ""} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={
                `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                  post!.image_refs![currentImageIndex]
                }` || ""
              }
              height="600"
              width="200"
              alt="Flower?"
              className="rounded-md mx-auto border-2 border-black "
            />
          )}
            <label>
              <span>Upload a Photo (JPG only I think)</span>
              <input type="file" name="files" accept="image/*,video/*" multiple />
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
