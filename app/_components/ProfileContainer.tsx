"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../_providers/UserProvider";
import { UserType } from "./PostContainer";
import { loadingFlower } from "@/public/flower-loading";
import ProfileOwner from "./ProfileOwner";

export default function ProfileContainer({ username, children }: any) {
  const user = useContext(UserContext);
  const [profileUser, setProfileUser] = useState<UserType | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [isUserProfile, setIsUserProfile] = useState<boolean>(false);

  useEffect(() => {
    async function getUserByUsername() {
      setLoading(true);

      const profileUserResult = await fetch(`/api/user?username=${username}`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => data.data);

      setProfileUser(profileUserResult);

      if (profileUserResult === undefined || profileUserResult === null || user === null || user.username !== profileUserResult.username) {
        setIsUserProfile(false);
      } else {
        setIsUserProfile(true);
      }

      setLoading(false);
    }

    getUserByUsername();
    // setLoading(false);
  }, [username, user]);

  return loading ? (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="text-muted mb-4">Loading profile...</div>
      <div>{loadingFlower}</div>
    </div>
  ) : !profileUser ? (
    <div className="text-center text-muted py-8">
      {`User "${username}" not found.`}
    </div>
  ) : (
    <>
    <ProfileOwner profUser={profileUser} />
    { children }
    </>
  );
}
