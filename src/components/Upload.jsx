import React, { useState } from "react";

function Upload() {
  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Preview
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const uploadImages = async () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("files", image);
    });

    const res = await fetch(
      "https://novainternational-backend.onrender.com/api/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    console.log(data.urls);
    alert("Upload successful");
  };

  return (
    <div>
      <h2>Upload Images</h2>

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={uploadImages}>Upload</button>

      <div>
        {preview.map((src, i) => (
          <img key={i} src={src} width="120" style={{ margin: "5px" }} />
        ))}
      </div>
    </div>
  );
}

export default Upload;
