"use client";

import { UUID } from "crypto";
import { useEffect, useState, useContext } from "react";

import Post from "../_components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
} from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "../_providers/UserProvider";
import PostProvider from "../_providers/PostProvider";

export interface CommentType {
  comment_id: UUID;
  body: string;
  total_likes: number;
  user_id: UUID;
  post_id: UUID;
  create_date: Date;
  username: string;
  been_edited: boolean;
}

export interface PostType {
  post_id: UUID;
  title: string;
  body: string;
  image_ref: string | null;
  image_refs: string[];
  create_date: Date;
  total_likes: number;
  comments: Array<CommentType>;
  username: string;
}

export default function PostContainer() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filters, setFilters] = useState({
    sortType: "date",
    order: "DESC",
    limit: "10",
  });
  const [likedItems, setLikedItems] = useState<Array<UUID>>([]);
  const user = useContext(UserContext);

  const PostProps = {
    deletePostFromArray,
    refreshPage,
    likedItems,
  };

  useEffect(() => {
    async function getLikedItems() {
      if (!user) return;

      const likedItemsResult = await fetch(`/api/likes?user_id=${user.id}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((res) => res.data);

      setLikedItems(likedItemsResult);
    }

    getLikedItems();
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(filters);
    params.set("order", sortOrder);
    const paramsString = params.toString();

    async function getPosts() {
      const postArray = await fetch(
        process.env.URL + `/api/posts?${paramsString}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => data.result)
        .catch((e) => {
          console.log(e);
        });

      for (let i = 0; i < postArray.length; i++) {
        postArray[i].image_refs = postArray[i].image_ref.split(";");
      }

      setPosts(postArray);
    }

    getPosts();
  }, [filters, sortOrder]);

  function toggleSortOrder() {
    setSortOrder(sortOrder === "DESC" ? "ASC" : "DESC");

    let newPosts = [...posts];
    newPosts.reverse();
    setPosts(newPosts);
  }

  function deletePostFromArray(id: UUID) {
    setPosts(posts.filter((post) => post.post_id !== id));
  }

  function refreshPage() {
    setTimeout(() => {
      window.location.reload();
      console.log("refreshed.");
    }, 100);
  }

  return posts.length > 0 ? (
    <>
      <div className="">
        <select
          value={filters.sortType}
          name="sort"
          onChange={(e) => setFilters({ ...filters, sortType: e.target.value })}
          className="border-2 rounded-md border-gray"
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="body">Body</option>
        </select>

        <button
          className="ml-2 p-1 bg-white rounded-md border-2"
          onClick={toggleSortOrder}
        >
          <FontAwesomeIcon
            icon={sortOrder === "DESC" ? faLongArrowDown : faLongArrowUp}
          />
        </button>
      </div>
      <div className="sm::w-[100%] w-[75%] max-w-[800px] flex flex-col items-center p-8 rounded-md scree">
        {posts.map((post: PostType) => {
          return (
            <PostProvider key={post.post_id} post={ post }>
              <Post {...PostProps} />
            </PostProvider>
          );
        })}
      </div>
    </>
  ) : (
    <div className="w-[50%] ">
      <div>No posts found.</div>
    </div>
  );
}
