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
      <p className="mt-4 text-success rounded-md border border-success bg-success/10 p-3 text-center">
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
      <p className="mt-4 text-success rounded-md border border-success bg-success/10 p-3 text-center">
        A password change email has been sent.
      </p>
    );
  }

  async function setNewPassword() {
    const passwordValid = testPassword(passwordValue, confirmPasswordValue);

    if (passwordValid.error) {
      setDisplayMessage(
        <p className="mt-4 text-error rounded-md border border-error bg-error/10 p-3">
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
        <p className="mt-4 text-error rounded-md border border-error bg-error/10 p-3">
          {passwordChangeResponse.error}
        </p>
      );
      return;
    }

    setDisplayMessage(
      <p className="text-success rounded-md border border-success bg-success/10 p-3 mt-4">
        Password changed! Redirecting...
      </p>
    );

    setTimeout(() => {
      router.push("/login");
    }, 3000);
  }

  return !isChangingPassword ? (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg bg-cover px-4">
      <div className="bg-surface border border-border w-full max-w-md flex flex-col items-center justify-center mx-auto rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-text mb-6">Reset Password</h1>
        <div className="w-full space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-muted mb-2">Enter your email/username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={usernameValue}
              onChange={(e) => {
                setUsernameValue(e.target.value);
              }}
              className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition disabled:opacity-50"
            />
          </div>
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
                    <p className="text-error rounded-md border border-error bg-error/10 p-3">
                      Username field empty
                    </p>
                  );
                }
              }}
              className="w-full bg-primary text-white border border-primary rounded-md px-6 py-3 font-semibold hover:bg-primaryDark transition"
            >
              Send email
            </button>
          )}
          {displayMessage}
        </div>
      </div>
    </main>
  ) : (
    <main className="min-h-screen flex flex-col justify-center items-center bg-login-bg bg-cover px-4">
      <div className="bg-surface border border-border w-full max-w-md flex flex-col items-center justify-center mx-auto rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-text mb-6">Reset Password</h1>
        <div className="w-full space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">Enter your new password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={passwordValue}
              onChange={(e) => {
                setPasswordValue(e.target.value);
              }}
              className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-muted mb-2">Confirm your password</label>
            <input
              type="password"
              name="confirm-password"
              id="confirm-password"
              value={confirmPasswordValue}
              onChange={(e) => {
                setConfirmPasswordValue(e.target.value);
              }}
              className="w-full p-3 border border-border rounded-md bg-background text-text focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition"
            />
          </div>
          <button
            className="w-full bg-primary text-white border border-primary rounded-md px-6 py-3 font-semibold hover:bg-primaryDark transition"
            onClick={() => setNewPassword()}
          >
            Reset Password
          </button>
          {displayMessage}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <p className="text-muted">Remembered your password?</p>
            <button
              className="bg-surface text-primary border border-primary rounded-md px-4 py-2 font-semibold hover:bg-primary hover:text-white transition"
              onClick={() => {
                setIsChangingPassword(false);
                router.push("/login");
              }}
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
