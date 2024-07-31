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
      alert("Photo uploaded successfully. (Maybe idk)");

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
        <input type="file" name="file" accept="image/*" required/>
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
