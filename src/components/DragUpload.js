import { useDropzone } from "react-dropzone";
import API from "../services/api";

export default function DragUpload({ folderId, reload }) {

  const onDrop = async (acceptedFiles) => {

    const file = acceptedFiles[0];

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderId", folderId);

    try {

      await API.post("/Documents/upload", formData);

      reload();

    } catch (err) {

      console.error("Upload failed", err);

    }

  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (

    <div
      {...getRootProps()}
      className={`border-2 border-dashed p-6 rounded text-center cursor-pointer 
      ${isDragActive ? "bg-blue-100" : "bg-gray-50"}`}
    >

      <input {...getInputProps()} />

      {isDragActive ? (

        <p>Drop the file here...</p>

      ) : (

        <p>Drag & drop a file here, or click to upload</p>

      )}

    </div>

  );

}