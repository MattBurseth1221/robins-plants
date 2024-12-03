"use client";

import { useContext, useEffect, useState } from "react";
import { formatDate, userIsAdmin } from "../_utils/helper-functions";
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
import { useRouter } from "next/navigation";
import { UserContext } from "../_providers/UserProvider";

const emptyArray = 'mt-8 opacity-50';

interface ProfileDataType {
  likedPosts: Array<PostType>;
  userPosts: Array<PostType>;
  userComments: Array<CommentType>;
}

export default function ProfileOwner({
  profileUser,
}: {
  profileUser: UserType;
}) {
  const user = useContext(UserContext);
  const [{ likedPosts, userPosts, userComments }, setProfileData] = useState<ProfileDataType>({ likedPosts: [], userPosts: [], userComments: [] });
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [likesResponse, postsResponse, commentsResponse] = await Promise.all([
        fetch(`/api/likes?user_id=${profileUser.id}`),
        fetch(`/api/posts/${profileUser.id}`),
        fetch(`/api/comments?user_id=${profileUser.id}`),
      ]);
  
      const likedPosts = (await likesResponse.json()).data;
      const userPosts = (await postsResponse.json()).data;
      const userComments = (await commentsResponse.json()).data;
  
      setProfileData({ likedPosts, userPosts, userComments });
    };
  
    fetchData();
  }, []);

  function toggleDeleteAccountModal() {
    setDeletingAccount(!deletingAccount);
  }

  function handleAccountDelete() {
    console.log("deleting account...");
  }

  async function updateProfile(formData: FormData) {
    
    formData.append("user_id", profileUser.id);

    const updateProfileResponse = await fetch(
      `/api/user?user_id=${profileUser.id}&action=update-profile`,
      {
        method: "PUT",
        body: formData,
      }
    ).then((res) => res.json());

    setEditingProfile(false);

    router.push(`/profile/${profileUser.username}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col w-[100%]">
      {editingProfile ? (
        <form action={updateProfile} className="w-[50%] mx-auto">
          {/* <div className="flex justify-center"> */}
          <div>
            <label htmlFor="firstname">First name</label>
            <input
              name="firstname"
              id="firstname"
              minLength={2}
              maxLength={32}
              className="w-[60%] focus:p-2 transition-all duration-150"
            />
          </div>

          <div>
            <label htmlFor="lastname">Last name</label>
            <input
              name="lastname"
              id="lastname"
              minLength={2}
              maxLength={32}
              className="w-[60%]"
            />
            <br />
          </div>
          <div className="flex justify-around">
            <button
              className="w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-green-500 transition"
              type="submit"
            >
              Save
            </button>
            <button
              className="w-42 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-red-500 hover:text-white transition"
              onClick={() => setEditingProfile(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8">
          <div className="">Hello, {profileUser!.username}!</div>
          <div>Profile view (owner)</div>
          <div>{`Full name: ${profileUser.first_name} ${profileUser.last_name}`}</div>
          <div>
            {`Account created on ${formatDate(
              new Date(profileUser.create_date)
            )}`}
          </div>
        </div>
      )}

      {!editingProfile && (
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
            <TabPanel>
              <h1 className="mb-2 text-xl">Posts</h1>
              {userPosts.length !== 0 ?
                userPosts.map((post: PostType) => {
                  return (
                    <div
                      key={post.post_id}
                      className="max-w-[50%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                    >
                      <div>{post.title}</div>
                      <div>{formatDate(new Date(post.create_date))}</div>
                    </div>
                  );
                }) : <div className={emptyArray}>User has no posts...</div>}
            </TabPanel>
            <TabPanel>
              <h1 className="mb-2 text-xl">Comments</h1>
              {userComments.length !== 0 ?
                userComments.map((comment: CommentType) => {
                  return (
                    <div
                      key={comment.comment_id}
                      className="max-w-[50%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                    >
                      <div>{comment.body}</div>
                      <div>{formatDate(new Date(comment.create_date))}</div>
                    </div>
                  );
                }) : <div className={emptyArray}>User has no comments...</div>}
            </TabPanel>
            <TabPanel>
              <h1 className="mb-2 text-xl">Likes</h1>
              {likedPosts.length !== 0 ? 
                likedPosts.map((post: PostType) => {
                  return (
                    <div
                      key={post.post_id}
                      className="max-w-[50%] flex flex-col mx-auto border-[1px] border-slate-500 rounded-md mb-2"
                    >
                      <div>{post.title}</div>
                      <div>{formatDate(new Date(post.create_date))}</div>
                    </div>
                  );
                }) : <div className={emptyArray}>User has no liked items...</div>}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      )}

      {(user?.username === profileUser.username || userIsAdmin(user)) && (
        <div className="flex flex-row justify-evenly">
          <button
            onClick={() => setEditingProfile(true)}
            className="mt-32 w-32 block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 hover:bg-red-500 hover:text-white hover:py-4 transition-all duration-300"
          >
            Edit account
          </button>

          <button
            onClick={() => setDeletingAccount(true)}
            className="mt-32 w-32 block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 hover:bg-red-500 hover:text-white hover:py-4 transition-all duration-300"
          >
            Delete account
          </button>
        </div>
      )}

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
