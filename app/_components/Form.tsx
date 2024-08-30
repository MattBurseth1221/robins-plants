"use client";

import { useFormState } from "react-dom";

export function Form({
  children,
  action,
}: {
  children: React.ReactNode;
  action: (prevState: any, formData: FormData) => Promise<ActionResult>;
}) {
  const [state, formAction] = useFormState(action, {
    error: null,
  });
  return (
    <form className="mb-2 mt-4" action={formAction}>
      {children}
      {state.error && (
        <p className="bg-red-500 opacity-70 p-2 rounded-md text-black text-opacity-100 text-center">
          {state.error}
        </p>
      )}
    </form>
  );
}

export interface ActionResult {
  error: string | null;
}
