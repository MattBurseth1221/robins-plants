"use client";

import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { UserContext } from "../_providers/UserProvider";

export default function UploadForm() {
  const router = useRouter();
  const user = useContext(UserContext);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileSelect = (formData: FormData) => {
    if (!user) router.push("/login");

    setLoading(true);

    postUpload(formData);
  };

  const postUpload = async (formData: FormData) => {
    const files = formData.getAll("files");

    if (files.length > 10) {
      alert("Maximum of 10 images/videos allowed.");
      setLoading(false);
      return;
    }

    const maxUploadSize = 2000 * 1024 * 1024;
    for (let file of files) {
      file = file as File;
      if (file.size > maxUploadSize) {
        alert("File size of 500MB exceeded.");
        setLoading(false);
        return;
      }
    }

    formData.append("user_id", user!.id);

    const response = await fetch("/api/posts", {
      method: "POST",
      body: formData,
    }).then((res) => res.json());

    console.log("response here");
    console.log(response);

    if (response.success) {
      alert("Photo uploaded successfully.");
      setLoading(false);
      router.push("/");
    }
  }

  return (
    <form action={handleFileSelect} className="flex flex-col gap-4">
      <label>
        <span>Upload a Photo (JPG only I think)</span>
        <input
          type="file"
          name="files"
          accept="image/*,video/*"
          multiple
          required
        />
      </label>
      <label>
        <span>Title</span>
        <input type="text" name="title" maxLength={50} required />
      </label>
      <label>
        <span>Body</span>
        <textarea name="body" rows={5} className="w-[100%]" required />
      </label>
      <button
        type="submit"
        className="border-2 border-gray-500 rounded-md w-[20%] mx-auto p-2 hover:bg-slate-400 transition disabled:text-gray-500 disabled:border-gray-300"
        disabled={loading}
      >
        Submit
      </button>
      {loading && (
        <svg
          version="1.1"
          viewBox="-58 -58 116 116"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          width="32"
          height="32"
          className="mx-auto"
        >
          <g strokeLinecap="round" strokeWidth="15">
            <path id="a" d="m0 35 0,14" />
            <use transform="rotate(210)" xlinkHref="#a" stroke="#f0f0f0" />
            <use transform="rotate(240)" xlinkHref="#a" stroke="#ebebeb" />
            <use transform="rotate(270)" xlinkHref="#a" stroke="#d3d3d3" />
            <use transform="rotate(300)" xlinkHref="#a" stroke="#bcbcbc" />
            <use transform="rotate(330)" xlinkHref="#a" stroke="#a4a4a4" />
            <use transform="rotate(0)" xlinkHref="#a" stroke="#8d8d8d" />
            <use transform="rotate(30)" xlinkHref="#a" stroke="#757575" />
            <use transform="rotate(60)" xlinkHref="#a" stroke="#5e5e5e" />
            <use transform="rotate(90)" xlinkHref="#a" stroke="#464646" />
            <use transform="rotate(120)" xlinkHref="#a" stroke="#2f2f2f" />
            <use transform="rotate(150)" xlinkHref="#a" stroke="#171717" />
            <use transform="rotate(180)" xlinkHref="#a" stroke="#000" />
          </g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 0 0"
            to="360 0 0"
            dur="1s"
            repeatCount="indefinite"
          />
        </svg>
      )}
    </form>
  );
}
