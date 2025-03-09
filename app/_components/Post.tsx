"use client";

import { useState, useContext, useEffect, useRef, createContext, useMemo } from "react";
import { CommentType } from "@/app/_components/PostContainer";
import { UUID } from "crypto";
import { formatDate, userIsAdmin } from "../_utils/helper-functions";

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

import { UserContext } from "../_providers/UserProvider";
import { PostContext } from "../_providers/PostProvider";

import Image from "next/image";
import UpdateDialog from "./UpdateDialog";
import DeleteDialog from "./DeleteDialog";
import Comment from "./Comment";
import Link from "next/link";

export type CommentContextType = {
  comments: CommentType[];
  setComments: Function;
}

export const CommentContext = createContext<CommentContextType>({comments: [], setComments: () => {}});

export default function Post({
  deletePostFromArray,
  likedItems,
}: {
  deletePostFromArray: Function;
  likedItems: Array<UUID>;
}) {
  const user = useContext(UserContext);
  const post = useContext(PostContext);
  const [comments, setComments] = useState<CommentType[]>([]);
  const value = useMemo(() => ({comments, setComments}), [comments])
  const [numLikes, setNumLikes] = useState<number>(post!.total_likes);
  const [confirmDeletePost, setConfirmDeletePost] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<boolean>(false);
  const [commentValue, setCommentValue] = useState<string>("");
  const [showAllComments, setShowAllComments] = useState<boolean>(false);
  const [postLiked, setPostLiked] = useState<boolean>(false);
  const usersLikedItems = useRef<UUID[]>(likedItems);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [heartBeat, setHeartBeat] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const UpdateDialogProps = {
    editingPost,
    setEditingPost,
    currentImageIndex,
    handleImageIndexChange,
  };

  const DeleteDialogProps = {
    deletePostFromArray,
    confirmDeletePost,
    setConfirmDeletePost,
  };

  const showCommentDiv = (
    <div className="mt-2">
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

  useEffect(() => {
    async function getComments() {
      try {
        const commentResult = await fetch(`/api/comments?post_id=${post?.post_id}`, {
          method: "GET",
        }).then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.log(data.error);
            return;
          }

          setComments(data.data);
        })
      } catch (e) {
        console.log("Unknown error occurred when fetching comments.");
        return;
      }
    }

    getComments();
  }, [post]);

  //Initializes and populates an array for all post_id's that the current user has liked
  useEffect(() => {
    setPostLiked(usersLikedItems.current.includes(post!.post_id));
  }, [post]);

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
        let resultingComment = response.resultingComment;
        resultingComment.username = user.username;

        setComments([resultingComment, ...comments]);

        console.log(response.success);
      } else {
        throw(response.error);
      }
    } catch (e) {
      console.log(e);
      return;
    }
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
        setNumLikes(numLikes + 1);
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
        setNumLikes(numLikes - 1);
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
      <div className="border-slate-300 border-2 bg-slate-100 mb-8 rounded-2xl text-center px-8 pb-8 justify-center w-[100%] lg:min-w-[600px] md:min-w-[600px] flex flex-col shadow-md">
        <p className="float-left mt-4 text-2xl text-left mb-2">{post.title}</p>
        {/* <div className="flex flex-row">
          {postPills.map((pill: PillType, index: number) => {
          return (
            <PostPill key={ index } type={ pill.type } text={ pill.text } />
          )
        })}
        </div> */}
        <div
          className={`relative ${
            post.image_refs.length > 1 ? "h-[600px]" : ""
          } overflow-auto flex items-center justify-center rounded-md`}
        >
          {post.image_refs![currentImageIndex].endsWith("-video") ? (
            <video
              width="600"
              className="rounded-md mx-auto border-2 border-black overflow-hidden max-h-full"
              controls
              key={post.image_refs[currentImageIndex]}
            >
              <source
                src={
                  `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                    post.image_refs![currentImageIndex]
                  }` || ""
                }
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          ) : (
            <Image
              src={
                `https://robinsplantsphotosbucket.s3.us-east-2.amazonaws.com/${
                  post.image_refs![currentImageIndex]
                }` || ""
              }
              height="0"
              width="1000"
              alt="Flower?"
              className="rounded-md mx-auto border-2 border-black block"
            />
          )}
        </div>

        <div className="min-h-16 mt-2">
          <div className="grid grid-cols-3 border-b-[1px] border-slate-500 border-opacity-20 pb-2">
            <Link className="text-left text-xl hover:text-gray-600 transition-all" href={`/profile/${post.username}`}>{post.username}</Link>

            {post.image_refs!.length !== 1 && (
              <div className="flex justify-center h-8">
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

            <div
              className={`${
                post.image_refs!.length === 1 ? "col-span-2" : ""
              } flex mr-0 ml-auto`}
            >
              <p className="text-right">
                {formatDate(new Date(post.create_date))}
              </p>
              <button className="ml-2" onClick={handleLikePost}>
                <FontAwesomeIcon
                  icon={postLiked ? faHeartSolid : faHeartOutline}
                  beat={heartBeat}
                />
              </button>
              <p className="text-sm mt-2">{numLikes}</p>
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
                <FontAwesomeIcon icon={faPaperPlane} shake={shouldShake} />
              </button>
            </form>
          </div>
          <div className="border-t-[1px] border-slate-500 border-opacity-20 py-2">
            {comments && comments.length > 0 ? (
              comments
                .slice(0, showAllComments ? comments.length : 3)
                .map((comment: CommentType, index: number) => {
                  return (
                    <CommentContext.Provider key={index} value={value}>
                      <Comment {...comment} />
                    </CommentContext.Provider>
                  )
                })
            ) : (
              <div className="opacity-50 text-center">
                <p>Be the first to comment!</p>
              </div>
            )}

            {comments && comments.length > 3 && showCommentDiv}
          </div>
        </div>

        {(userIsAdmin(user) || post.username === user!.username) && (
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
                setConfirmDeletePost(!confirmDeletePost);
              }}
            >
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        )}
      </div>

      <DeleteDialog {...DeleteDialogProps} />
      <UpdateDialog {...UpdateDialogProps} />
    </>
  ) : (
    <div>Loading post...</div>
  );
}
