"use client";

import { UUID } from "crypto";
import { useEffect, useState, createContext } from "react";

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

const UserContext = createContext<any>(null);

export default function PostContainer(user: any) {
  const [currentUser, setCurrentUser] = useState(user);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [sortOrder, setSortOrder] = useState("DESC");
  const [filters, setFilters] = useState({
    sortType: "date",
    order: "DESC",
    limit: "5",
  });

  

  useEffect(() => {
    const params = new URLSearchParams(filters);
    params.set("order", sortOrder);
    const paramsString = params.toString();

    async function getPosts() {
      const postArray = await fetch(process.env.URL + `/api/posts?${paramsString}`, {
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

  function deletePostFromArray(id: UUID) {
    setPosts(posts.filter((post) => post.post_id !== id));
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

        <button className="ml-2 p-1 bg-white rounded-md border-2" onClick={toggleSortOrder}>
          <FontAwesomeIcon
            icon={sortOrder === "DESC" ? faLongArrowDown : faLongArrowUp}
          />
        </button>
      </div>
      <div className="w-[75%] max-w-[800px] flex flex-col items-center p-8 rounded-md">
        {posts.map((post: PostType) => {
          return <UserContext.Provider value={ user }><Post key={post.post_id} postInfo={post} deletePostFromArray={ deletePostFromArray } /></UserContext.Provider>;
        })}
      </div>
    </>
  ) : (
    <div className="w-[50%] bg-gray-300">
      <div>No posts found. Try again later.</div>
    </div>
  );
}
