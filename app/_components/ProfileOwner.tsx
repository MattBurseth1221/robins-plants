"use client";

import { useEffect, useRef, useState } from "react";
import { formatDate } from "../_utils/helper-functions";
import { PostType, UserType } from "./PostContainer";
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
  const userPosts = useRef<Array<PostType>>([]);

  useEffect(() => {
    async function getPosts() {
      const postResponse = await fetch(`/api/posts/${profileUser.id}`)
      .then(
        (res) => res.json()
      );

      console.log(postResponse);

      userPosts.current = postResponse;
    }

    getPosts();
  });

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
            Tab 1
          </Tab>
          <Tab className="data-[selected]:bg-slate-500 data-[selected]:text-white data-[hover]:underline transition-all rounded-xl px-4 py-1">
            Tab 2
          </Tab>
          <Tab className="data-[selected]:bg-slate-500 data-[selected]:text-white data-[hover]:underline transition-all rounded-xl px-4 py-1">
            Tab 3
          </Tab>
        </TabList>
        <TabPanels className="mt-4">
          <TabPanel>
            <h1>Posts</h1>
            {userPosts.current && userPosts.current.map((post: PostType) => {
              return (
                <div className="w-[75%] flex flex-col">
                  <div>{post.title}</div>
                  <div>{formatDate(new Date(post.create_date))}</div>
                </div>
              )
            })}
          </TabPanel>
          <TabPanel>Comments</TabPanel>
          <TabPanel>Something else</TabPanel>
        </TabPanels>
      </TabGroup>

      <button
        onClick={() => setDeletingAccount(true)}
        className="mt-32 w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
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
