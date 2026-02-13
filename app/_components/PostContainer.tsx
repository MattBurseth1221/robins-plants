"use client";

import { UUID } from "crypto";
import { useEffect, useState, useContext } from "react";

import Post from "../_components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
  faFilter,
  faChevronDown,
  faChevronUp,
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
  const [showFilters, setShowFilters] = useState<boolean>(false);
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
    <div className="flex flex-col items-center justify-center text-center py-12">
      <p className="mr-2 text-text">Loading posts...</p>
      <div className="mt-4">{loadingFlower}</div>
    </div>
  ) : posts.length > 0 ? (
    <div className="w-full max-w-2xl mx-auto">
      {/* Filter Toggle Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 text-text hover:bg-primary/10 transition focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        >
          <FontAwesomeIcon icon={faFilter} className="text-muted" />
          <span className="font-medium">Filters</span>
          <FontAwesomeIcon 
            icon={showFilters ? faChevronUp : faChevronDown} 
            className="text-muted ml-auto" 
          />
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 bg-surface border border-border rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Sort & Filter</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-muted hover:text-text transition"
            >
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Sort by
              </label>
              <select
                value={filters.sortType}
                name="sort"
                onChange={(e) => setFilters({ ...filters, sortType: e.target.value })}
                className="w-full border border-border rounded-md p-2 cursor-pointer bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
              >
                <option value="date">Date</option>
                <option value="title">Title</option>
                <option value="body">Body</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Order
              </label>
              <button
                onClick={toggleSortOrder}
                className="w-full flex items-center justify-center gap-2 p-2 bg-background border border-border rounded-md text-text hover:bg-primary/10 transition focus:outline-hidden focus:ring-2 focus:ring-primary/20"
              >
                <FontAwesomeIcon
                  icon={sortOrder === "DESC" ? faLongArrowDown : faLongArrowUp}
                />
                <span>{sortOrder === "DESC" ? "Newest First" : "Oldest First"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col space-y-8">
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
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-20">
      <div className="text-muted text-lg">No posts found.</div>
    </div>
  );
}
