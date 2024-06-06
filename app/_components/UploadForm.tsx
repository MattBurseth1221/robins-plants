"use client";

import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const router = useRouter();

  const handleFileSelect = async (formData: FormData) => {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    if (response.success) {
      router.replace('/admin');
    }

    console.log(response);
  };

  function displayError() {
    alert("No file");
  }

  return (
    <form action={handleFileSelect} className="flex flex-col gap-4">
      <label>
        <span>Upload a file</span>
        <input type="file" name="file" />
      </label>
      <label>
        <span>Title</span>
        <input type="text" name="title" />
      </label>
      <label>
        <span>Body</span>
        <input type="text" name="body" />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
