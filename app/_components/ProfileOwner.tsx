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
      <div className="max-w-2xl mx-auto">
        <Form action={updateProfile} page={"profile"} >
          <div className="space-y-6">
            <div>
              <label htmlFor="firstname" className="block text-text font-medium mb-2">First name</label>
              <input
                name="firstname"
                id="firstname"
                minLength={2}
                maxLength={32}
                className="w-full p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                defaultValue={profileUser.first_name}
              />
            </div>

            <div>
              <label htmlFor="lastname" className="block text-text font-medium mb-2">Last name</label>
              <input
                name="lastname"
                id="lastname"
                minLength={2}
                maxLength={32}
                className="w-full p-2 rounded-md bg-background text-text transition"
                defaultValue={profileUser.last_name}
              />
            </div>
            {/* <div>
              <label htmlFor="pronouns" className="block text-text font-medium mb-2">Pronouns</label>
              <input
                name="pronouns"
                id="pronouns"
                minLength={2}
                maxLength={32}
                className="w-full p-2 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
                defaultValue={ "He/Him" }
              />
            </div> */}
            <div className="flex gap-4">
              <button
                className="flex-1 bg-primaryDark text-white border border-primaryDark rounded-md px-6 py-2 font-semibold hover:bg-primary hover:border-primary cursor-pointer transition"
                type="submit"
              >
                Save
              </button>
              <button
                className="flex-1 bg-surface text-muted border border-border rounded-md px-6 py-2 font-semibold hover:bg-background cursor-pointer transition"
                onClick={() => setEditingProfile(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Form>
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-8 bg-linear-to-r from-primary/20 to-secondary/20 rounded-xl p-8 border border-border">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {profileUser.username.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-text mb-2">@{profileUser.username}</h1>
            <p className="text-muted text-lg">{`${profileUser.first_name} ${profileUser.last_name}`}</p>
            <p className="text-muted text-sm">Joined {formatDate(new Date(profileUser.create_date))}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primaryDark">{userPosts.length}</div>
          <div className="text-muted text-sm">Posts</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-secondaryDark">{userComments.length}</div>
          <div className="text-muted text-sm">Comments</div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-primary">{likedPosts.length}</div>
          <div className="text-muted text-sm">Likes</div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl">
        <TabGroup defaultIndex={0}>
          <TabList className="flex space-x-1 bg-background p-1 rounded-lg m-6">
            <Tab className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 data-selected:bg-primaryDark data-selected:text-white transition">
              Posts
            </Tab>
            <Tab className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 data-selected:bg-secondaryDark data-selected:text-white transition">
              Comments
            </Tab>
            <Tab className="flex-1 py-2 px-4 rounded-md text-sm font-medium text-muted hover:text-text hover:bg-surface focus:outline-hidden focus:ring-2 focus:ring-primary/20 data-selected:bg-primary data-selected:text-white transition">
              Likes
            </Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <h2 className="text-xl font-semibold text-text mb-4 ml-6">Posts</h2>
              {userPosts.length !== 0 ? (
                <div className="space-y-3">
                  {userPosts.map((post: PostType) => (
                    <div
                      key={post.post_id}
                      className="not-even:bg-background w-full p-2 transition"
                    >
                      <div className="font-medium text-text">{post.title}</div>
                      <div className="text-muted text-sm">{formatDate(new Date(post.create_date))}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-8">No posts yet...</div>
              )}
            </TabPanel>
            <TabPanel>
              <h2 className="text-xl font-semibold text-text mb-4 ml-6">Comments</h2>
              {userComments.length !== 0 ? (
                <div className="space-y-3">
                  {userComments.map((comment: CommentType) => (
                    <div
                      key={comment.comment_id}
                      className="not-even:bg-background w-full p-2 transition"
                    >
                      <div className="text-text">{comment.body}</div>
                      <div className="text-muted text-sm mt-2">{formatDate(new Date(comment.create_date))}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-8">No comments yet...</div>
              )}
            </TabPanel>
            <TabPanel>
              <h2 className="text-xl font-semibold text-text mb-4 ml-6">Likes</h2>
              {likedPosts.length !== 0 ? (
                <div className="">
                  {likedPosts.map((post: PostType) => (
                    <div
                      key={post.post_id}
                      className="not-even:bg-background w-full p-2 transition"
                    >
                      <div className="font-medium text-text">{post.title}</div>
                      <div className="text-muted text-sm">{formatDate(new Date(post.create_date))}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted py-8">No liked posts yet...</div>
              )}
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </div>

      {(user?.username === profileUser.username || userIsAdmin(user)) && (
        <div className="flex gap-4 justify-center mt-8">
          <button
            onClick={() => setEditingProfile(true)}
            className="bg-primaryDark text-white border border-primaryDark rounded-md px-6 py-2 font-semibold hover:bg-primaryDark/90 cursor-pointer transition"
          >
            Edit Profile
          </button>

          {/* <button
            onClick={() => setDeletingAccount(true)}
            className="bg-error text-white border border-error rounded-md px-6 py-2 font-semibold hover:bg-error/80 cursor-pointer transition"
          >
            Delete Account
          </button> */}
        </div>
      )}

      {deletingAccount && (
        <Dialog
          open={deletingAccount}
          onClose={toggleDeleteAccountModal}
          className="fixed inset-0 z-50"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40" aria-hidden="true" />
          <div className="fixed inset-0 flex w-screen items-center justify-center p-4 z-50">
            <DialogPanel className="max-w-lg space-y-4 border border-border bg-surface p-12 rounded-xl shadow-2xl relative z-50">
              <DialogTitle className="font-bold text-text">Delete Account?</DialogTitle>
              <Description className="text-muted">
                This will permanently delete your account.
              </Description>
              <p className="text-text">
                Are you sure you want to delete your account? All of your posts
                and comments will also be deleted. This is irreversible.
              </p>
              <div className="flex gap-4">
                <button
                  className="hover:bg-muted/20 text-muted rounded-md p-2 transition duration-150"
                  onClick={toggleDeleteAccountModal}
                >
                  Cancel
                </button>
                <button
                  className="bg-error text-white p-2 rounded-md hover:bg-error/80 transition duration-150"
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
