"use client";

import {
  useState,
  useContext,
  useEffect,
  useRef,
  createContext,
  useMemo,
} from "react";
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

import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline } from "@fortawesome/free-regular-svg-icons";

import { UserContext } from "../_providers/UserProvider";
import { PostContext } from "../_providers/PostProvider";

import UpdateDialog from "./UpdateDialog";
import DeleteDialog from "./DeleteDialog";
import Comment from "./Comment";
import Link from "next/link";

import { PillType } from "../types";
import PostPill from "./PostPill";
import PostPhotoContainer from "./PostPhotoContainer";

import { AutoTextArea } from "react-textarea-auto-witdth-height";
import TextArea from "./TextArea";

export type CommentContextType = {
  comments: CommentType[];
  setComments: Function;
};

export const CommentContext = createContext<CommentContextType>({
  comments: [],
  setComments: () => {},
});

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
  const value = useMemo(() => ({ comments, setComments }), [comments]);
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
  const [postPills, setPostPills] = useState<PillType[]>([
    { type: "genus", text: "Zinnia" },
    { type: "postType", text: "Progress" },
  ]);

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

  const PostPhotoContainerProps = {
    images: post!.image_refs,
    handleImageIndexChange,
    currentImageIndex,
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
        const commentResult = await fetch(
          `/api/comments?post_id=${post?.post_id}`,
          {
            method: "GET",
          },
        )
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              console.log(data.error);
              return;
            }

            setComments(data.data);
          });
      } catch (e) {
        console.log("Error fetching comments.");
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
      } else {
        throw response.error;
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
        },
      ).then((res) => res.json());

      if (likeResponse.success) {
        setNumLikes(numLikes + 1);
      } else {
        alert("Problem liking post.");
      }
    } else {
      const deleteLikeResponse = await fetch(
        `/api/likes?parent_id=${post!.post_id}&user_id=${user.id}`,
        {
          method: "DELETE",
        },
      ).then((res) => res.json());

      if (deleteLikeResponse.success) {
        setNumLikes(numLikes - 1);
      } else {
        alert("Problem unliking post.");
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
      <div className="border-border border-2 bg-surface mb-8 rounded-2xl text-center px-8 pb-8 justify-center w-full lg:min-w-[600px] md:min-w-[600px] flex flex-col shadow-md">
        <p className="float-left mt-4 text-2xl text-left text-text mb-2">
          {post.title}
        </p>
        {/* <div className="flex flex-row">
          {postPills.map((pill: PillType, index: number) => {
          return (
            <PostPill key={ index } type={ pill.type } text={ pill.text } />
          )
        })}
        </div> */}

        {post.image_refs.length > 0 && (
          <PostPhotoContainer {...PostPhotoContainerProps} />
        )}

        <div className="min-h-16 mt-2">
          <div className="flex flex-row border-b border-border border-opacity-50 pb-2 relative">
            <div className="text-left">
              <Link
                className="text-left text-xl hover:text-muted transition-all text-text"
                href={`/profile/${post.username}`}
              >
                {post.username}
              </Link>
            </div>

            <div className="flex flex-row items-center text-right absolute right-0">
              <p className="text-right text-muted text-sm">
                {formatDate(new Date(post.create_date))}
              </p>
              <button
                className="ml-2 hover:bg-accent/10 transition rounded-md p-1"
                onClick={handleLikePost}
              >
                <FontAwesomeIcon
                  icon={postLiked ? faHeartSolid : faHeartOutline}
                  beat={heartBeat}
                />
              </button>
              <p className="text-sm mt-2 text-muted">{numLikes}</p>
            </div>
          </div>

          <p className="text-left mt-4 wrap-break-word line-clamp-3 text-text">
            {post.body}
          </p>

          <div>
            <form
              id="comment-form"
              action={addComment}
              className="flex justify-center items-center mt-4"
            >
              <TextArea
                placeholder={"Leave a comment..."}
                className="bg-background w-full p-2 rounded-xl box-content border border-border max-h-[30vh] text-text placeholder-muted focus:border-primary focus:ring-2 focus:ring-primary outline-0 transition"
                name="comment_body"
                textValue={commentValue}
                setTextValue={setCommentValue}
                required={true}
              ></TextArea>
              <button
                className="hover:bg-primary hover:text-white hover:cursor-pointer bg-surface text-primary border border-primary transition rounded-md p-2 ml-2 mb-4"
                type="submit"
              >
                <FontAwesomeIcon icon={faPaperPlane} shake={shouldShake} />
              </button>
            </form>
          </div>
          <div className="border-t border-border border-opacity-50 py-2">
            {comments && comments.length > 0 ? (
              comments
                .slice(0, showAllComments ? comments.length : 3)
                .map((comment: CommentType, index: number) => {
                  return (
                    <CommentContext.Provider key={index} value={value}>
                      <Comment {...comment} />
                    </CommentContext.Provider>
                  );
                })
            ) : (
              <div className="opacity-50 text-center text-muted">
                <p>Be the first to comment!</p>
              </div>
            )}

            {comments && comments.length > 3 && showCommentDiv}
          </div>
        </div>

        {(userIsAdmin(user) || post.username === user!.username) && (
          <div className="w-[20%] mx-auto mt-4 flex justify-between">
            <button
              className="hover:bg-primary hover:text-white bg-surface text-primary border border-primary transition rounded-md p-2 hover:cursor-pointer"
              onClick={() => {
                setEditingPost(!editingPost);
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>

            <button
              className="hover:bg-error hover:text-white bg-surface text-error border border-error transition rounded-md p-2 hover:cursor-pointer"
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
