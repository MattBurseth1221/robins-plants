"use client";

import { useFileUpload } from "../_lib/hooks/useFileUpload";
// import { uploadFile } from "./upload-action";

export default function UploadForm() {
  const uploadFile = useFileUpload();

  const handleFileSelect = async (formData: FormData) => {
    console.log(formData.get("file"));

    const file = formData.get("file") as File;

    // const result = await fetch('/api/upload')
    // .then((res) => res.json());

    // //const uploadOk = await uploadFile(file.name, file);

    console.log(formData.get("file"));

    const postres = await fetch('api/upload', 
      {
        method: 'POST',
        body: formData,
      }
    ).then((res) => res.json());

    console.log(postres);

    // if (uploadOk) {
    //     console.log(uploadOk);
    //   alert('good');
    // } else {
    //   alert('bad');
    // }
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
      <button type="submit">Submit</button>
    </form>
  );
}
