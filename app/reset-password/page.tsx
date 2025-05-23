"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { generateSHA256, testPassword } from "../_utils/helper-functions";
import { UUID } from "node:crypto";

export default function Page() {
  const [usernameValue, setUsernameValue] = useState<string>("");
  const [isChangingPassword, setIsChangingPassword] = useState<boolean>(false);
  const [displayMessage, setDisplayMessage] = useState<JSX.Element>(<></>);
  const [passwordValue, setPasswordValue] = useState<string>("");
  const [confirmPasswordValue, setConfirmPasswordValue] = useState<string>("");
  const [changingUserID, setChangingUserID] = useState<UUID | null>(null);
  const [isSendEmailButtonHidden, setIsSendEmailButtonHidden] =
    useState<boolean>(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const resetID = searchParams.get("id");

    async function isResetIDValid(resetID: string) {
      const validIDCheck = await fetch(`/api/password?id=${resetID}`, {
        method: "GET",
      }).then((res) => res.json());

      if (validIDCheck.error) {
        return;
      }

      const user_id = validIDCheck.user_id;
      if (!user_id) return;

      setChangingUserID(user_id);

      if (resetID && resetID !== "" && validIDCheck.isIDValid) {
        console.log("reset id valid");
        setIsChangingPassword(true);
      }

      setIsChangingPassword(true);
    }

    isResetIDValid(resetID!);
  }, [searchParams]);

  async function sendPasswordResetEmail() {
    if (!usernameValue || typeof usernameValue !== "string") return;

    setDisplayMessage(
      <p className="mt-4 text-green-600 rounded-md border-[1px] border-green-600 bg-green-100 p-2 text-center inline-block">
        A password change email has been sent.
      </p>
    );

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
      
      return;
    }

    const emailResponse = await fetch("/api/send", {
      method: "POST",
      body: JSON.stringify({
        tempPasswordID: passwordChangeResponse.tempPasswordID,
        email: passwordChangeResponse.email,
        usernameValue: passwordChangeResponse.username,
      }),
    }).then((res) => res.json());

    setDisplayMessage(
      <p className="mt-4 text-green-600 rounded-md border-[1px] border-green-600 bg-green-100 p-2 text-center inline-block">
        A password change email has been sent.
      </p>
    );
  }

  async function setNewPassword() {
    const passwordValid = testPassword(passwordValue, confirmPasswordValue);

    if (passwordValid.error) {
      setDisplayMessage(
        <p className="mt-4 text-red-500 rounded-md border-[1px] border-red-500 bg-red-100 p-2">
          {passwordValid.error}
        </p>
      );
      return;
    }

    const newPasswordHash = generateSHA256(passwordValue);

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

    if (passwordChangeResponse.error) {
      setDisplayMessage(
        <p className="mt-4 text-red-500 rounded-md border-[1px] border-red-500 bg-red-100 p-2">
          {passwordChangeResponse.error}
        </p>
      );
      return;
    }

    setDisplayMessage(
      <p className="text-green-600 rounded-md border-[1px] border-green-600 bg-green-100 p-2 mt-4">
        Password changed! Redirecting...
      </p>
    );

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  return !isChangingPassword ? (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg bg-cover px-4">
      <div className="bg-white w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-xl flex flex-col items-center justify-center mx-auto rounded-xl p-8 sm:p-8 md:p-8 lg:p-10">
        <h1 className="text-xl md:text-2xl mb-4">Reset Password</h1>
        <h2 className="text-left mb-2">Enter your email/username</h2>
        <input
          type="text"
          name="username"
          id="username"
          value={usernameValue}
          onChange={(e) => {
            setUsernameValue(e.target.value);
          }}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:text-opacity-30"
        />
        {!isSendEmailButtonHidden && (
          <button
            id="email-button"
            onClick={() => {
              if (usernameValue && usernameValue !== "") {
                document
                  .getElementById("email-button")
                  ?.setAttribute("disabled", "true");
                document
                  .getElementById("username")
                  ?.setAttribute("disabled", "true");
                setIsSendEmailButtonHidden(true);
                sendPasswordResetEmail();
              } else {
                setDisplayMessage(
                  <p className="text-red-500 rounded-md border-[1px] border-red-500 bg-red-100 mt-4 p-2">
                    Username field empty
                  </p>
                );
              }
            }}
            className="w-40 mt-4 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
          >
            Send email
          </button>
        )}
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
            className="mt-4 w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
            onClick={() => setNewPassword()}
          >
            Reset
          </button>
        </div>
        {displayMessage}
        <div className="mt-4 flex items-center">
          <p className="w-64">Remembered your password?</p>
          <button
            className="w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
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
