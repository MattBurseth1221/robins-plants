"use client";

import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { UserContext } from '../_providers/UserProvider';

export default function UploadForm() {
  const router = useRouter();
  const user = useContext(UserContext);

  const handleFileSelect = async (formData: FormData) => {
    if (!user) router.push("/login");

    const files = formData.getAll("files");

    if (files.length > 10) {
      alert("Maximum of 10 images/videos allowed.");
      return;
    }

    const maxUploadSize = 2000 * 1024 * 1024;
    for (let file of files) {
      file = file as File;
      if (file.size > maxUploadSize) {
        alert("File size of 500MB exceeded.");
        return;
      }
    } 
 
    formData.append("user_id", user!.id);

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    if (response.success) {
      alert("Photo uploaded successfully.");

      router.push('/');
    }

    console.log(response);
  };

  function displayError() {
    alert("No file");
  }

  return (
    <form action={handleFileSelect} className="flex flex-col gap-4">
      <label>
        <span>Upload a Photo (JPG only I think)</span>
        <input type="file" name="files" accept="image/*,video/*" multiple required/>
      </label>
      <label>
        <span>Title</span>
        <input type="text" name="title" maxLength={50} required/>
      </label>
      <label>
        <span>Body</span>
        <textarea name="body" rows={5} className="w-[100%]" required/>
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
