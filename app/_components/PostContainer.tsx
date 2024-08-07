"use client";

import { UUID } from "crypto";
import { useEffect, useState, createContext, useContext } from "react";

import Post from "../_components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { UserContext } from "../_providers/UserProvider";

export interface CommentType {
  comment_id: UUID;
  body: string;
  total_likes: number;
  user_id: UUID;
  post_id: UUID;
  create_date: Date;
  username: string;
}

export interface PostType {
  post_id: UUID;
  title: string;
  body: string;
  image_ref: string | null;
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
  }

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

      setPosts(postArray);
    }

    getPosts();
  }, [filters]);

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

  return posts ? (
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
            <Post
              key={post.post_id}
              postInfo={post}
              {...PostProps}
            />
          );
        })}
      </div>
    </>
  ) : (
    <div className="w-[50%] bg-gray-300">
      <div>No posts found. Try again later.</div>
    </div>
  );
}
