"use client";

import { useEffect, useState } from "react";
import { formatDate } from "../_utils/helper-functions";
import { CommentType, PostType, UserType } from "./PostContainer";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";

export default function ProfileOwner({
  profileUser,
}: {
  profileUser: UserType;
}) {
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const [userPosts, setUserPosts] = useState<Array<PostType>>([]);
  const [likedPosts, setLikedPosts] = useState<Array<PostType>>([]);
  const [userComments, setUserComments] = useState<Array<CommentType>>([]);

  useEffect(() => {
    async function getPosts() {
      const postResponse = await fetch(`/api/posts/${profileUser.id}`).then(
        (res) => res.json()
      ).catch((e) => console.log(e));

      setUserPosts(postResponse.data);
    }

    async function getComments() {
      const postResponse = await fetch(`/api/comments/${profileUser.id}`).then(
        (res) => res.json()
      ).catch((e) => console.log(e));

      setUserComments(postResponse.data);
    }

    getPosts();
  }, []);

  useEffect(() => {
    async function getLikedItems() {
      const likedItemsResult = await fetch(
        `/api/likes?user_id=${profileUser.id}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((res) => res.data);

      setLikedPosts(likedItemsResult);
    }

    getLikedItems();
  }, [profileUser]);

  function toggleDeleteAccountModal() {
    setDeletingAccount(!deletingAccount);
  }

  function handleAccountDelete() {
    console.log("deleting account...");
  }

  return (
    <div className="flex flex-col w-[100%]">
      <div className="">Hello, {profileUser!.username}!</div>
      <div>Profile view (owner)</div>
      <div>{`Full name: ${profileUser.first_name} ${profileUser.last_name}`}</div>
      <div>{`Account created on ${formatDate(
        new Date(profileUser.create_date)
      )}`}</div>

      <TabGroup defaultIndex={0}>
        <TabList className="flex justify-between w-[50%] mx-auto">
          <Tab className="data-[selected]:bg-slate-500 data-[selected]:text-white data-[hover]:underline transition-all rounded-xl px-4 py-1">
            Posts
          </Tab>
          <Tab className="data-[selected]:bg-slate-500 data-[selected]:text-white data-[hover]:underline transition-all rounded-xl px-4 py-1">
            Comments
          </Tab>
          <Tab className="data-[selected]:bg-slate-500 data-[selected]:text-white data-[hover]:underline transition-all rounded-xl px-4 py-1">
            Likes
          </Tab>
        </TabList>
        <TabPanels className="mt-4">
          <TabPanel className="flex flex-col justify-center">
            <h1 className="mb-2 text-xl">Posts</h1>
            {userPosts &&
              userPosts.map((post: PostType) => {
                return (
                  <div
                    key={post.post_id}
                    className="w-[75%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                  >
                    <div>{post.title}</div>
                    <div>{formatDate(new Date(post.create_date))}</div>
                  </div>
                );
              })}
          </TabPanel>
          <TabPanel>
            <h1 className="mb-2 text-xl">Comments</h1>
            {userComments &&
              userComments.map((comment: CommentType) => {
                return (
                  <div
                    key={comment.post_id}
                    className="w-[75%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                  >
                    <div>{comment.post_id}</div>
                    <div>{formatDate(new Date(comment.create_date))}</div>
                  </div>
                );
              })}
          </TabPanel>
          <TabPanel>
            <h1 className="mb-2 text-xl">Likes</h1>
            {likedPosts &&
              likedPosts.map((post: PostType) => {
                return (
                  <div
                    key={post.post_id}
                    className="w-[75%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                  >
                    <div>{post.title}</div>
                    <div>{formatDate(new Date(post.create_date))}</div>
                  </div>
                );
              })}
          </TabPanel>
        </TabPanels>
      </TabGroup>

      <button
        onClick={() => setDeletingAccount(true)}
        className="mt-32 w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 hover:bg-red-500 hover:text-white hover:py-4 transition-all duration-300"
      >
        Delete account
      </button>

      {deletingAccount && (
        <Dialog
          open={deletingAccount}
          onClose={toggleDeleteAccountModal}
          className="relative z-50"
        >
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
            <DialogPanel className="max-w-lg space-y-4 border bg-white p-12 rounded-md">
              <DialogTitle className="font-bold">Delete Account?</DialogTitle>
              <Description>
                This will permanently delete your account.
              </Description>
              <p>
                Are you sure you want to delete your account? All of your posts
                and comments will also be deleted. This is irreversible.
              </p>
              <div className="flex gap-4">
                <button
                  className="hover:bg-slate-300 rounded-md p-2 transition duration-150"
                  onClick={toggleDeleteAccountModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-500 text-white p-2 rounded-md hover:bg-red-400 hover:text-black transition duration-150"
                  onClick={handleAccountDelete}
                >
                  Delete
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </div>
  );
}
