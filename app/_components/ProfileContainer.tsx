"use client";

import {
  useContext,
  useEffect,
  useState,
} from "react";
import { UserContext } from "../_providers/UserProvider";
import { UserType } from "./PostContainer";
import { loadingFlower } from "@/public/flower-loading";

export default function ProfileContainer({ username }: any) {
  const user = useContext(UserContext);
  const [profileUser, setProfileUser] = useState<UserType | null>(null);

  useEffect(() => {
    async function getUserByUsername() {
      const profileUserResult = await fetch(`/api/user?username=${username}`,
        {
          method: "GET",
        }
      )
        .then((res) => res.json())
        .then((data) => data.data);

        setProfileUser(profileUserResult);
    }
    
    getUserByUsername();
  }, [username]);

  return profileUser ? (<div className="">Hello {profileUser!.username}!</div>) : <div className="">{loadingFlower}</div>;
}
