"use client";

import { GSP_NO_RETURNED_VALUE } from "next/dist/lib/constants";
import { useActionState, useEffect, useState } from "react";
//import { useFormState } from "react-dom";
var zxcvbn = require("zxcvbn");

export function Form({
  children,
  action,
  page,
}: {
  children: React.ReactNode;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
  page: string;
}) {
  const [state, formAction] = useActionState(action, {
    error: null,
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [strengthText, setStrengthText] = useState<JSX.Element>(<></>);

  useEffect(() => {
    switch (passwordStrength) {
      case 0:
        setStrengthText(
          <span className={`text-red-500`}>Password strength: Very Weak</span>
        );
        break;
      case 1:
        setStrengthText(
          <span className={`text-red-300`}>Password strength: Weak</span>
        );
        break;
      case 2:
        setStrengthText(
          <span className={`text-blue-200`}>Password strength: Average</span>
        );
        break;

      case 3:
        setStrengthText(
          <span className={`text-green-300`}>Password strength: Strong</span>
        );
        break;

      case 4:
        setStrengthText(
          <span className={`text-green-600`}>
            Password strength: Very Strong
          </span>
        );
        break;
      default:
        setStrengthText(<></>);
        break;
    }
  }, [passwordStrength]);

  return (
    <form
      className="mb-2 mt-4 flex flex-col justify-center items-center w-[100%] max-w-[400px]"
      action={formAction}
      onChange={(e: any) => {
        let result = zxcvbn(e.target.value);
        setPasswordStrength(result.score);
      }}
    >
      {children}
      {page !== "login" && (
        <progress
          value={passwordStrength}
          max="4"
          className="bg-slate-300 rounded-full w-[75%] mx-auto [&::-moz-progress-bar]-rounded-full"
        ></progress>
      )}
      {page !== "login" && strengthText}
      {state.error && (
        <p className="border-md border-red-500 border-2 bg-red-300 opacity-100 p-2 px-4 rounded-md text-black text-opacity-100 text-center w-fit mt-4 mx-auto ">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
