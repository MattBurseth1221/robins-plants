"use client";

import { UUID } from "crypto";
import { useEffect, useState } from "react";

import Post from "../_components/Post";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowDown,
  faLongArrowUp,
} from "@fortawesome/free-solid-svg-icons";

export interface PostType {
  post_id: UUID;
  title: string;
  body: string;
  image_ref: string | null;
  create_date: Date;
}

// interface FilterType {
//   limit: string | "";
//   where: string | "";
// }

export default function PostContainer() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filters, setFilters] = useState({
    sortType: "date",
    order: "DESC",
    limit: "5",
  });

  useEffect(() => {
    const params = new URLSearchParams(filters).toString();

    async function getPosts() {
      const postArray = await fetch(process.env.URL + `/api/posts?${params}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => data.result)
        .catch((e) => {
          console.log(e);
        });
      //console.log(postArray);

      setPosts(postArray);
      console.log(posts);
    }

    getPosts();
  }, [filters]);

  function toggleSortOrder() {
    setSortOrder(sortOrder === 'DESC' ? 'ASC' : 'DESC');

    let newPosts = [...posts];
    newPosts.reverse();
    setPosts(newPosts);
  }

  return posts ? (
    <>
      <div>
        <select
          value={filters.sortType}
          name="sort"
          onChange={(e) => setFilters({ ...filters, sortType: e.target.value })}
        >
          <option value="date">Date</option>
          <option value="title">Title</option>
          <option value="body">Body</option>
        </select>

        <button onClick={toggleSortOrder}>
          <FontAwesomeIcon
            icon={sortOrder === "DESC" ? faLongArrowDown : faLongArrowUp}
          />
        </button>
      </div>
      <div className="w-[75%] max-w-[800px] flex flex-col items-center p-8 rounded-md">
        {posts.map((post: PostType) => {
          return <Post key={post.post_id} postInfo={post} />;
        })}
      </div>
    </>
  ) : (
    <div className="w-[50%] bg-gray-300">
      <div>No posts found. Try again later.</div>
    </div>
  );
}
