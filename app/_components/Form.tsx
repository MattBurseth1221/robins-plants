"use client";

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
  const [passwordStrength, setPasswordStrength] = useState<number>(-1);
  const [strengthText, setStrengthText] = useState<JSX.Element>(<></>);
  const [passwordValue, setPasswordValue] = useState<string>("");

  useEffect(() => {
    console.log(passwordValue);
    if (!passwordValue || passwordValue.length === 0) {
      setStrengthText(<></>);
      return;
    }

    switch (passwordStrength) {
      case 0:
        setStrengthText(
          <span
            className={`text-red-500 rounded-md border-[1px] border-red-500 bg-red-100 p-2 mt-4`}
          >
            Password strength: Very Weak
          </span>
        );
        break;
      case 1:
        setStrengthText(
          <span
            className={`text-orange-400 rounded-md border-[1px] border-orange-400 bg-orange-100 p-2 mt-4`}
          >
            Password strength: Weak
          </span>
        );
        break;
      case 2:
        setStrengthText(
          <span
            className={`text-blue-400 rounded-md border-[1px] border-blue-400 bg-blue-100 p-2 mt-4`}
          >
            Password strength: Average
          </span>
        );
        break;

      case 3:
        setStrengthText(
          <span
            className={`text-green-400 rounded-md border-[1px] border-green-400 bg-green-50 p-2 mt-4`}
          >
            Password strength: Strong
          </span>
        );
        break;

      case 4:
        setStrengthText(
          <span
            className={`text-green-600 rounded-md border-[1px] border-green-600 bg-green-100 p-2 mt-4`}
          >
            Password strength: Very Strong
          </span>
        );
        break;
      default:
        setStrengthText(<></>);
        break;
    }
  }, [passwordStrength, passwordValue]);

  return (
    <form
      className="mb-2 mt-4 flex flex-col justify-center items-center w-[100%] max-w-md"
      action={formAction}
      onChange={(e: any) => {
        if (page !== "login" && e.target.id === "password") {
          setPasswordValue(e.target.value);
          let result = zxcvbn(e.target.value);
          setPasswordStrength(result.score);
        }
      }}
    >
      {children}
      {page !== "login" && strengthText}
      {state.error && (
        <p className="border-md border-red-500 border-[1px] bg-red-100 opacity-100 p-2 px-4 rounded-md text-red-500 text-opacity-100 text-center w-fit mt-4 mx-auto ">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
