"use client";

import { useContext, useEffect, useState, FormEvent } from "react";
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
import { ActionResult, Form } from "./Form";

const emptyArray = "mb-2 mt-4 opacity-50";

interface ProfileDataType {
  likedPosts: Array<PostType>;
  userPosts: Array<PostType>;
  userComments: Array<CommentType>;
}

interface UpdateProfileFormType {
  firstName: string;
  lastName: string;
}

export default function ProfileOwner({
  profUser,
}: {
  profUser: UserType;
}) {
  const user = useContext(UserContext);
  const [profileUser, setProfileUser] = useState<UserType>(profUser);
  const [{ likedPosts, userPosts, userComments }, setProfileData] =
    useState<ProfileDataType>({
      likedPosts: [],
      userPosts: [],
      userComments: [],
    });
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<boolean>(false);
  const [profileUpdateForm, setProfileUpdateForm] =
    useState<UpdateProfileFormType>({
      firstName: profUser.first_name,
      lastName: profUser.last_name,
    });

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const [likesResponse, postsResponse, commentsResponse] =
        await Promise.all([
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
  }, [profileUser]);

  function toggleDeleteAccountModal() {
    setDeletingAccount(!deletingAccount);
  }

  async function handleAccountDelete() {
    console.log("deleting account...");

    const deleteUserResult = await fetch(`/api/user`, {
      method: "DELETE",
      body: JSON.stringify({ user_id: user!.id }),
    }).then((res) => res.json());

    if (deleteUserResult.error) {
      alert("There was an issue deleting the user.");
      console.log(deleteUserResult.error);
      return;
    }

    console.log(deleteUserResult.success);
    router.push("/");
  }

  async function updateProfile(
    _: any,
    formData: FormData
  ): Promise<ActionResult> {
    let firstName = formData.get("firstname") as string;
    let lastName = formData.get("lastname") as string;

    if (
      !firstName ||
      firstName.trim().length === 0 ||
      !lastName ||
      lastName.trim().length === 0
    ) {
      //Probably need to have inline error here at some point, for now just cancel request
      return {
        error: "Fields cannot be null",
      };
    }

    formData.append("user_id", profileUser.id);

    const updateProfileResponse = await fetch(
      `/api/user?user_id=${profileUser.id}&action=update-profile`,
      {
        method: "PUT",
        body: formData,
      }
    ).then((res) => res.json());

    if (updateProfileResponse.error) {
      return {
        error: updateProfileResponse.error,
      };
    }

    setProfileUser({...profileUser, first_name: firstName, last_name: lastName});

    setEditingProfile(false);

    return { error: null };
  }

  // const formChangeHandler = (e: FormEvent<HTMLInputElement>) => {
  //   setProfileUpdateForm({
  //     ...profileUpdateForm,
  //     [e.currentTarget.name]: e.currentTarget.value,
  //   });
  // };

  //OLD style for form: className="w-[50%] mx-auto"

  if (editingProfile)
    return (
      <Form action={updateProfile} page={"profile"} >
        {/* <div className="flex justify-center"> */}
        <div>
          <label htmlFor="firstname">First name</label>
          <input
            name="firstname"
            id="firstname"
            minLength={2}
            maxLength={32}
            className="w-[60%]"
            defaultValue={profileUser.first_name}
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
            defaultValue={profileUser.last_name}
          />
          <br />
        </div>
        <div className="flex justify-around">
          <button
            className="w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-green-500 hover:text-white transition"
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
      </Form>
    );

  return (
    <div className="w-[100%]">
      <div className="mb-8 text-left bg-slate-100 max-w-[50%] rounded-md border-slate-300 border-2 p-4 shadow-md">
        <div className="">Hello, {profileUser!.username}!</div>
        {/* <div>Profile view (owner)</div> */}
        <div>{`Full name: ${profileUser.first_name} ${profileUser.last_name}`}</div>
        <div>
          {`Account created: ${formatDate(new Date(profileUser.create_date))}`}
        </div>
      </div>

      <div className="p-4 border-2 border-slate-300 max-w-[50%] rounded-md bg-slate-100 shadow-md">
        <TabGroup defaultIndex={0}>
          <TabList className="flex justify-between mx-auto">
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
              {userPosts.length !== 0 ? (
                userPosts.map((post: PostType) => {
                  return (
                    <div
                      key={post.post_id}
                      className="max-w-[50%] flex flex-col mx-auto rounded-md mb-2"
                    >
                      <div>{post.title}</div>
                      <div>{formatDate(new Date(post.create_date))}</div>
                    </div>
                  );
                })
              ) : (
                <div className={emptyArray}>User has no posts...</div>
              )}
            </TabPanel>
            <TabPanel>
              <h1 className="mb-2 text-xl">Comments</h1>
              {userComments.length !== 0 ? (
                userComments.map((comment: CommentType) => {
                  return (
                    <div
                      key={comment.comment_id}
                      className="max-w-[50%] flex flex-col mx-auto rounded-md mb-2"
                    >
                      <div>{comment.body}</div>
                      <div>{formatDate(new Date(comment.create_date))}</div>
                    </div>
                  );
                })
              ) : (
                <div className={emptyArray}>User has no comments...</div>
              )}
            </TabPanel>
            <TabPanel>
              <h1 className="mb-2 text-xl">Likes</h1>
              {likedPosts.length !== 0 ? (
                likedPosts.map((post: PostType) => {
                  return (
                    <div
                      key={post.post_id}
                      className="max-w-[50%] flex flex-col mx-auto rounded-md mb-2"
                    >
                      <div>{post.title}</div>
                      <div>{formatDate(new Date(post.create_date))}</div>
                    </div>
                  );
                })
              ) : (
                <div className={`${emptyArray}`}>
                  User has no liked items...
                </div>
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {(user?.username === profileUser.username || userIsAdmin(user)) && (
        <div className="max-w-[50%] flex flex-row justify-evenly">
          <button
            onClick={() => setEditingProfile(true)}
            className="mt-32 w-32 block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 hover:bg-red-500 hover:text-white transition-all duration-150"
          >
            Edit account
          </button>

          <button
            onClick={() => setDeletingAccount(true)}
            className="mt-32 w-32 block border-gray-400 border-opacity-50 border-2 rounded-xl p-2 hover:bg-red-500 hover:text-white transition-all duration-150"
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
