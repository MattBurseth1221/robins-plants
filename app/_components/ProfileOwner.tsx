"use client";

import { useState } from "react";
import { formatDate } from "../_utils/helper-functions";
import { UserType } from "./PostContainer";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";

export default function ProfileOwner({
  profileUser,
}: {
  profileUser: UserType;
}) {
  const [deletingAccount, setDeletingAccount] = useState<boolean>(false);

  function toggleDeleteAccountModal() {
    setDeletingAccount(!deletingAccount);
  }

  function handleAccountDelete() {
    console.log("deleting account...");
  }

  return (
    <>
      <div className="">Hello, {profileUser!.username}!</div>
      <div>Profile view (owner)</div>
      <div>{`Full name: ${profileUser.first_name} ${profileUser.last_name}`}</div>
      <div>{`Account created on ${formatDate(
        new Date(profileUser.create_date)
      )}`}</div>
      <button
        onClick={() => setDeletingAccount(true)}
        className="mb-4 w-32 block mx-auto border-gray-400 border-opacity-50 border-2 rounded-xl p-2 px-8 hover:bg-gray-200 transition"
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
                Are you sure you want to delete your account? This is
                irreversible.
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
    </>
  );
}
