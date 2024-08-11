"use client";

import { useState, useContext, useEffect, useRef } from "react";
import { CommentType, PostType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrashCan,
  faEdit,
  faPaperPlane,
  faAnglesDown,
  faAnglesUp,
} from "@fortawesome/free-solid-svg-icons";
import {
  faSquareCaretLeft,
  faSquareCaretRight,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

import { library } from "@fortawesome/fontawesome-svg-core";
library.add(faHeartSolid, faHeartOutline, faPaperPlane);

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { UserContext } from "../_providers/UserProvider";
import { removeMilliseconds, userIsAdmin } from "../_utils/helper-functions";
import { PostContext } from "../_providers/PostProvider";
import UpdateDialog from "./UpdateDialog";

export default function Post({
  deletePostFromArray,
  refreshPage,
  likedItems,
}: {
  deletePostFromArray: Function;
  refreshPage: Function;
  likedItems: Array<UUID>;
}) {
  const user = useContext(UserContext);
  const post = useContext(PostContext);
  const [confirmDeletePost, setConfirmDeletePost] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>("");
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const usersLikedItems = useRef<Array<UUID>>(likedItems);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [heartBeat, setHeartBeat] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const UpdateDialogProps = {
    editingPost,
    setEditingPost,
    currentImageIndex,
    handleImageIndexChange,
  }

  const showCommentDiv = (
    <div>
      <button
        onClick={() => {
          setShowAllComments(!showAllComments);
        }}
      >
        {showAllComments ? (
          <FontAwesomeIcon icon={faAnglesUp} />
        ) : (
          <FontAwesomeIcon icon={faAnglesDown} />
        )}
      </button>
    </div>
  );

  //Initializes and populates an array for all post_id's that the current user has liked
  useEffect(() => {
    setPostLiked(usersLikedItems.current.includes(post!.post_id));
  }, []);

  //Toggles the confirm delete modal and selects the current
  function handleDeletePost() {
    setConfirmDeletePost(!confirmDeletePost);
  }

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

  //Takes form data from comment field and sends it to comments post endpoint
  async function addComment(formData: FormData) {
    const comment_body = formData.get("comment_body") as string;

    if (!comment_body || comment_body.length === 0) {
      setShouldShake(true);

      setTimeout(() => {
        setShouldShake(false);
      }, 250);
      return;
    }
    setCommentValue("");

    if (!user) return;

    formData.append("user_id", user.id);
    formData.append("post_id", post!.post_id);

    try {
      let response = await fetch(`/api/comments`, {
        method: "POST",
        body: formData,
      }).then((res) => res.json());

      if (response.success) {
        console.log(response.success);
      } else {
        console.log(response.error);
      }

      response.resultingComment[0].username = user.username;

      post!.comments.unshift(response.resultingComment[0]);
    } catch (e) {
      console.log(e);
      return;
    }

    //TODO
    //Look into adding the comment client side, refresh on comment addition is clunky
    //refreshPage();
    //--Handled?
  }

  //Fires when a user likes or dislikes a post - either creates a like entry in DB or deletes
  async function handleLikePost() {
    if (!user) return;

    if (!postLiked) {
      const likeResponse = await fetch(
        `/api/likes?post_id=${post!.post_id}&user_id=${user.id}`,
        {
          method: "POST",
        }
      ).then((res) => res.json());

      if (likeResponse.success) {
        console.log(likeResponse.success);
        post!.total_likes++;
      } else {
        alert("Something went wrong.");
      }
    } else {
      const deleteLikeResponse = await fetch(
        `/api/likes?parent_id=${post!.post_id}&user_id=${user.id}`,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());

      if (deleteLikeResponse.success) {
        console.log(deleteLikeResponse.success);
        post!.total_likes--;
      } else {
        alert("Something went wrong.");
      }
    }

    setHeartBeat(true);

    setTimeout(() => {
      setHeartBeat(false);
    }, 750);

    setPostLiked(!postLiked);
  }

  //Adjusts the current image index if post contains multiple photos
  function handleImageIndexChange(addition: number) {
    let newIndex = currentImageIndex + addition;
    if (newIndex === post!.image_refs.length)
      newIndex = newIndex % post!.image_refs.length;
    else if (newIndex === -1) newIndex = post!.image_refs.length - 1;

    setCurrentImageIndex(newIndex);
  }

  return post ? (
    <>
      <div className="border-black border-2 bg-slate-100 mb-8 rounded-2xl text-center px-8 pb-8 justify-center w-[100%] flex flex-col">
        <p className="float-left my-4 text-2xl text-left">{post.title}</p>
        <div className={`relative ${post.image_refs.length > 1 ? "h-[600px]" : ""} overflow-auto flex items-center justify-center rounded-md`}>
          <Image
            src={
              `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                post.image_refs![currentImageIndex]
              }` || ""
            }
            height="600"
            width="600"
            alt="Flower?"
            className="rounded-md mx-auto border-2 border-black "
          />
        </div>

        <div className="min-h-16 mt-2">
          <div className="flex flex-row justify-between items-center border-b-[1px] border-slate-500 border-opacity-20 px-2 pb-2">
            <p className="text-left text-xl max-w-[33%]">{post.username}</p>
            {post.image_refs!.length !== 1 && (
              <div className="flex justify-center w-[33%] absolute h-8">
                <button
                  onClick={() => {
                    handleImageIndexChange(-1);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSquareCaretLeft}
                    className="size-8 opacity-50"
                  />
                </button>
                <button
                  onClick={() => {
                    handleImageIndexChange(1);
                  }}
                >
                  <FontAwesomeIcon
                    icon={faSquareCaretRight}
                    className="size-8 opacity-50"
                  />
                </button>
              </div>
            )}
            <div className="ml-auto flex max-w-[33%]">
              <p className="text-right">
                {removeMilliseconds(new Date(post.create_date))}
              </p>
              <button className="ml-2" onClick={handleLikePost}>
                <FontAwesomeIcon
                  icon={postLiked ? faHeartSolid : faHeartOutline}
                  beat={heartBeat}
                />
              </button>
              <p className="text-sm mt-2">{post.total_likes}</p>
            </div>
          </div>

          <p className="text-left mt-4 break-words line-clamp-3">{post.body}</p>

          <div>
            <form
              id="comment-form"
              action={addComment}
              className="flex justify-center items-center mt-4"
            >
              <textarea
                placeholder={"Leave a comment..."}
                rows={1}
                className="bg-gray-300 w-[100%] p-1 pl-2 rounded-xl box-content border-none max-h-[30vh]"
                name="comment_body"
                value={commentValue}
                onChange={(e) => setCommentValue(e.target.value)}
              ></textarea>
              <button
                className="hover:bg-gray-300 transition rounded-md p-1 ml-2 mb-4"
                type="submit"
              >
                <FontAwesomeIcon icon="paper-plane" shake={shouldShake} />
              </button>
            </form>
          </div>
          <div className="border-t-[1px] border-slate-500 border-opacity-20 py-2">
            {post.comments && post.comments.length > 0 ? (
              post.comments
                .slice(0, showAllComments ? post.comments.length : 3)
                .map((comment: CommentType, index) => {
                  return (
                    <div className="mt-2" key={index}>
                      <div className="flex justify-between">
                        <p className="text-left opacity-50 text-xs">
                          {comment.username}
                        </p>
                        <p className="text-right opacity-50 text-xs min-w-[25%]">
                          {removeMilliseconds(new Date(comment.create_date))}
                        </p>
                      </div>

                      <p className="text-left break-words line-clamp-3">{comment.body}</p>
                    </div>
                  );
                })
            ) : (
              <div className="opacity-50 text-center">
                <p>Be the first to comment!</p>
              </div>
            )}

            {post.comments && post.comments.length > 3 && showCommentDiv}
          </div>
        </div>

        {userIsAdmin(user) && (
          <div className="w-[20%] mx-auto mt-4 flex justify-between">
            <button
              className="hover:bg-slate-300 transition rounded-md p-1"
              onClick={() => {
                setEditingPost(!editingPost);
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>

            <button
              className="hover:bg-slate-300 transition rounded-md p-1"
              onClick={() => {
                handleDeletePost();
              }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        )}
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

      <UpdateDialog {...UpdateDialogProps} />
    </>
  ) : (
    <div>Loading post...</div>
  );
}
