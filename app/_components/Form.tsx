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
            className={`text-error rounded-md border border-error bg-error/10 p-3 mt-4`}
          >
            Password strength: Very Weak
          </span>
        );
        break;
      case 1:
        setStrengthText(
          <span
            className={`text-secondary rounded-md border border-secondary bg-secondary/10 p-3 mt-4`}
          >
            Password strength: Weak
          </span>
        );
        break;
      case 2:
        setStrengthText(
          <span
            className={`text-primary rounded-md border border-primary bg-primary/10 p-3 mt-4`}
          >
            Password strength: Average
          </span>
        );
        break;

      case 3:
        setStrengthText(
          <span
            className={`text-accent rounded-md border border-accent bg-accent/10 p-3 mt-4`}
          >
            Password strength: Strong
          </span>
        );
        break;

      case 4:
        setStrengthText(
          <span
            className={`text-success rounded-md border border-success bg-success/10 p-3 mt-4`}
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
      className="mb-2 mt-4 flex flex-col justify-center items-center w-full max-w-md"
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
        <p className="border border-error bg-error/10 text-error p-3 rounded-md text-center w-fit mt-4 mx-auto">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
