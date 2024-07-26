"use client";

import { useState, useContext } from "react";
import { PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function Post({ postInfo, deletePostFromArray }: any) {
  const user = useContext(UserContext);
  const [post, setPost] = useState<PostType>(postInfo);
  const [confirmDeletePost, setConfirmDeletePost] = useState<boolean>(false);
  const [deletePostUUID, setDeletePostUUID] = useState<UUID | null>(null);

  function handleDeletePost() {
    if (!confirmDeletePost) {
      setConfirmDeletePost(true);
      setDeletePostUUID(post.post_id);
    } else {
      setConfirmDeletePost(false);
      setDeletePostUUID(null);
    }

    return;
  }

  async function deletePost() {
    if (!deletePostUUID) return;

    const response = await fetch(`/api/posts?id=${deletePostUUID}`, {
      method: "DELETE",
    }).then((res) => res.json());

    if (response.success) {
      console.log(response.success);
    } else {
      console.log(response.error);
    }

    deletePostFromArray(deletePostUUID);

    setConfirmDeletePost(false);
  }

  return post ? (
    <>
      <div className="border-black border-2 bg-slate-100 mb-8 rounded-md text-center p-8 justify-center w-[100%]">
        <Image
          src={
            `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${post.image_ref}` ||
            ""
          }
          width="900"
          height="0"
          alt="Flower?"
          className="rounded-md mx-auto"
        />

        <div className="min-h-16 mt-2 line-clamp-3">
          <div className="flex flex-row justify-between border-b-[1px] border-slate-500 border-opacity-20">
            <h1 className="text-left text-xl max-w-[50%]">{post.title}</h1>
            <p className="max-w-[50%] text-right">
              {new Date(post.create_date).toLocaleString()}
            </p>
          </div>

          <p className="text-left mt-4 break-words">{post.body}</p>
        </div>

        
        <div>
          <button
            className="mt-2"
            onClick={() => {
              handleDeletePost();
              console.log(confirmDeletePost);
            }}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
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
              Are you sure you want to delete this post? It will be a pain in
              the ass to put it back up again...
            </p>
            <div className="flex gap-4">
              <button onClick={() => handleDeletePost()}>Cancel</button>
              <button
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400 hover:text-black transition"
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
    </>
  ) : (
    <div>Loading post...</div>
  );
}
