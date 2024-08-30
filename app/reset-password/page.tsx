"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { sha256, testPassword } from "../_utils/helper-functions";
import { UUID } from "node:crypto";

//export const runtime = "edge";

export default function Page() {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [displayMessage, setDisplayMessage] = useState<JSX.Element>(<></>);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");
  const [changingUserID, setChangingUserID] = useState<UUID | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resetID = searchParams.get("id");
    console.log("searching for params...");

    console.log("reset id: " + resetID);

    async function isResetIDValid(resetID: string) {
      console.log("calling the api");

      const validIDCheck = await fetch(`/api/password?id=${resetID}`, {
        method: "GET",
      }).then((res) => res.json());

      console.log("back from the api, here's the response:");
      console.log(validIDCheck);
      console.log(validIDCheck.result);

      if (validIDCheck.error) {
        console.log(validIDCheck.error);
        return;
      }

      const user_id = validIDCheck.user_id;
      console.log(user_id);
      if (!user_id) return;

      setChangingUserID(user_id);

      if (resetID && resetID !== "" && validIDCheck.isIDValid) {
        console.log("in here");
        setIsChangingPassword(true);
      }
    }

    isResetIDValid(resetID!);
  }, []);

  async function sendPasswordResetEmail() {
    if (!usernameValue || typeof usernameValue !== "string") return;

    const passwordChangeResponse = await fetch(
      "/api/user?action=reset-password-email",
      {
        method: "PUT",
        body: JSON.stringify({
          usernameValue: usernameValue,
        }),
      }
    ).then((res) => res.json());

    if (passwordChangeResponse.error) {
      setDisplayMessage(
        <p className="mt-4 text-red-600 outline-black">
          {passwordChangeResponse.error}
        </p>
      );
      return;
    }

    console.log(passwordChangeResponse);

    const emailResponse = await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        tempPasswordID: passwordChangeResponse.tempPasswordID,
        email: passwordChangeResponse.email,
      }),
    }).then((res) => res.json());

    console.log(emailResponse);

    if (emailResponse.success) {
      console.log(emailResponse.success);
      setDisplayMessage(
        <p className="mt-4 text-green-700 outline-black">
          Password change email sent.
        </p>
      );
    }
  }

  async function setNewPassword() {
    const passwordValid = testPassword(passwordValue, confirmPasswordValue);

    console.log(passwordValid);

    if (passwordValid.error) {
      setDisplayMessage(
        <p className="mt-4 text-red-600 outline-black">{passwordValid.error}</p>
      );
      return;
    }

    console.log("changing user id " + changingUserID);
    console.log("using password " + passwordValue);

    const newPasswordHash = sha256(passwordValue);
    console.log(newPasswordHash);

    const passwordChangeResponse = await fetch(
      "/api/user?action=reset-password",
      {
        method: "PUT",
        body: JSON.stringify({
          user_id: changingUserID,
          newPasswordHash: newPasswordHash,
        }),
      }
    ).then((res) => res.json());

    console.log("do we make it here");

    if (passwordChangeResponse.error) {
      console.log(passwordChangeResponse.error);
      setDisplayMessage(
        <p className="mt-4 text-red-600 outline-black">
          {passwordChangeResponse.error}
        </p>
      );
      return;
    }

    setDisplayMessage(
      <p className="mt-4 text-green-700 outline-black">
        Password changed! Redirecting...
      </p>
    );

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  return !isChangingPassword ? (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto border-opacity-20 border-gray-800 rounded-xl border-4 p-8">
        <h1 className="text-xl mb-4">Reset Password</h1>

        <h2 className="float-left mb-2">Enter your email/username</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={usernameValue}
          onChange={(e) => {
            setUsernameValue(e.target.value);
          }}
          className="border-[1px] border-gray-400 p-2 w-[50%] rounded-md"
        />
        <button
          onClick={() => {
            sendPasswordResetEmail();
          }}
          className="mt-4"
        >
          Send email
        </button>
        {displayMessage}
      </div>
    </main>
  ) : (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg h-[900px] bg-cover">
      <div className="bg-white flex flex-col items-center w-[700px] justify-center mx-auto border-opacity-20 border-gray-800 rounded-xl border-4 p-8">
        <h1 className="mb-4 text-xl">The link worked.</h1>
        <div>
          <h2 className="float-left mb-2">Enter your new password</h2>
          <input
            type="password"
            name="password"
            id="password"
            value={passwordValue}
            onChange={(e) => {
              setPasswordValue(e.target.value);
            }}
            className="border-[1px] border-gray-400 p-2 w-[100%] rounded-md mb-4"
          />
          <h2 className="text-left mb-2">Confirm your password</h2>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPasswordValue}
            onChange={(e) => {
              setConfirmPasswordValue(e.target.value);
            }}
            className="border-[1px] border-gray-400 p-2 w-[100%] rounded-md"
          />
          <button
            className="mt-2 w-[100%] mx-auto"
            onClick={() => setNewPassword()}
          >
            Reset
          </button>
        </div>
        {displayMessage}
        <div className="mt-4 flex justify-between">
          <p className="w-64">Remembered your password?</p>
          <button
            onClick={() => {
              setIsChangingPassword(false);
              router.push("/login");
            }}
          >
            Sign in
          </button>
        </div>
      </div>
    </main>
  );
}
