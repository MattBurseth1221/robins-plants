export function useFileUpload() {
  return async (filename: string, file: File) => {
    const result = await fetch(`/api/google?file=${filename}`, {
      method: "POST",
      body: file,
    })
    .then((res) => res.json())
    .then((res) => res.response)
    .catch((e) => console.log(e));
    
    const { url, fields } = result;

    const formData = new FormData();

    console.log('made it');

    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      formData.append(key, value as string | Blob);
      console.log(key, value);
    });

    for (var pair of formData.entries()){
        console.log(pair[0]);
        console.log(pair[1]);
    }

    console.log(url);

    const upload = await fetch(url + `${filename}`, {
        method: "POST",
        body: formData,
        headers: {
            'Access-Control-Allow-Origin': '*',
        }
      }).catch((e) => console.log(e));

      console.log('here');

    return upload;
  };
}
