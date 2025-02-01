"use client";

import React, { useLayoutEffect, useRef } from "react";

const MIN_TEXTAREA_HEIGHT = 32;

export default function TextArea({
  name,
  className,
  textValue,
  setTextValue,
  placeholder, 
  required,
}: {
  name: string;
  className: string;
  textValue: string;
  setTextValue: Function;
  placeholder: string;
  required: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const onChange = (event: any) => setTextValue(event.target!.value);

  useLayoutEffect(() => {
    // Reset height - important to shrink on delete
    textareaRef.current!.style.height = "inherit";
    // Set height
    textareaRef.current!.style.height = `${Math.max(
      textareaRef.current!.scrollHeight,
      MIN_TEXTAREA_HEIGHT
    )}px`;
  }, [textValue]);

  return (
    <textarea
      name={name}
      onChange={onChange}
      ref={textareaRef}
      className={className}
      style={{
        minHeight: MIN_TEXTAREA_HEIGHT,
        resize: "none",
      }}
      value={textValue}
      placeholder={placeholder}
      required={required}
    />
  );
}
