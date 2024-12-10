"use client";

import { useActionState } from "react";
import { useFormState } from "react-dom";

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
    <form className="mb-2 mt-4" action={formAction}>
      {children}
      {state.error && (
        <p className="inline-block border-md border-red-500 border-2 bg-red-300 opacity-100 p-2 px-4 rounded-md text-black text-opacity-100 text-center mt-2 w-auto m-auto ">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
