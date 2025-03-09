"use client";

import { useActionState } from "react";
//import { useFormState } from "react-dom";

export function Form({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useActionState(action, {
    error: null,
  });
  return (
    <form className="mb-2 mt-4 flex-col justify-center" action={formAction}>
      {children}
      {state.error && (
        <p className="border-md border-red-500 border-2 bg-red-300 opacity-100 p-2 px-4 rounded-md text-black text-opacity-100 text-center w-fit my-4 mx-auto ">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
