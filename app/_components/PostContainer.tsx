"use client";

import { UUID } from "crypto";
import { useEffect, useState, useContext } from "react";

import Post from "../_components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { loadingFlower } from "@/public/flower-loading";

import { UserContext } from "../_providers/UserProvider";
import PostProvider from "../_providers/PostProvider";

export interface UserType {
  id: UUID;
  create_date: Date;
  username: string;
  email: string | null;
  first_name: string;
  last_name: string;
}

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
  username: string;
}

export default function PostContainer() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filters, setFilters] = useState({
    sortType: "date",
    order: "DESC",
    limit: "30",
  });
  const [likedItems, setLikedItems] = useState<Array<UUID>>([]);
  const [loadingPosts, setLoadingPosts] = useState<Boolean>(true);
  const user = useContext(UserContext);

  const PostProps = {
    deletePostFromArray,
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

        let likedItems = [];

        for (let i = 0; i < likedItemsResult.length; i++) {
          likedItems.push(likedItemsResult[i].post_id);
        }

      setLikedItems(likedItems);
    }

    getLikedItems();
  }, [user]);

  useEffect(() => {
    setLoadingPosts(true);

    const params = new URLSearchParams(filters);
    params.set("order", sortOrder);
    const paramsString = params.toString();

    async function getPosts() {
      const postArray = await fetch(`/api/posts?${paramsString}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => data.result)
        .catch((e) => {
          console.log(e);
        });

      for (let i = 0; i < postArray.length; i++) {
        postArray[i].image_refs = postArray[i].image_ref.split(";");
      }

      setPosts(postArray);
      setLoadingPosts(false);
    }

    getPosts();

    //setLoadingPosts(false);
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

  return loadingPosts ? (
    <div className="flex justify-center text-center">
      <p className="mr-2">Loading posts...</p>
      <div className="">{loadingFlower}</div>
    </div>
    
  ) : posts.length > 0 ? (
    <div className="sm:w-[100%]">
      <div className="">
        <select
          value={filters.sortType}
          name="sort"
          onChange={(e) => setFilters({ ...filters, sortType: e.target.value })}
          className="border-2 rounded-md border-gray p-1 cursor-pointer bg-white"
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
      <div className="lg:w-[75%] sm:w-[100%] max-w-[800px] flex flex-col items-center p-8 rounded-md mx-auto">
        {posts.map((post: PostType) => {
          return (
            <PostProvider key={post.post_id} post={post}>
              <Post {...PostProps} />
            </PostProvider>
          );
        })}
      </div>
    </div>
  ) : (
    <div className="w-[50%] ">
      <div>No posts found.</div>
    </div>
  );
}
