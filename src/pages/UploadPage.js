import { useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import API from "../services/api";

export default function UploadPage() {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [projects, setProjects] = useState([]);
  const [projectId, setProjectId] = useState("");

  const [folders, setFolders] = useState([]);
  const [folderId, setFolderId] = useState("");

  const [file, setFile] = useState(null);

  // =========================
  // LOAD PROJECTS
  // =========================
  useEffect(() => {

    const loadProjects = async () => {

      try {

        const res = await API.get("/Projects");

        setProjects(res.data);

      } catch (err) {

        console.error("Project load error:", err);

      }

    };

    loadProjects();

  }, []);

  // =========================
  // LOAD FOLDERS WHEN PROJECT CHANGES
  // =========================
  useEffect(() => {

    if (!projectId) return;

    const loadFolders = async () => {

      try {

        const res = await API.get(`/Folders/project/${projectId}`);

        console.log("Folders:", res.data);

        setFolders(res.data);

      } catch (err) {

        console.error("Folder load error:", err);

      }

    };

    loadFolders();

  }, [projectId]);

  // =========================
  // DROPZONE
  // =========================
  const onDrop = (acceptedFiles) => {

    if (acceptedFiles.length > 0) {

      setFile(acceptedFiles[0]);

    }

  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  // =========================
  // UPLOAD DOCUMENT
  // =========================
  const uploadDocument = async () => {

  if (!file || !folderId || !projectId || !title) {
    alert("Please fill all required fields");
    return;
  }

  const formData = new FormData();

  // exact fields expected by backend
  formData.append("File", file);
  formData.append("Title", title);
  formData.append("Description", description || "");
  formData.append("ProjectId", parseInt(projectId));
  formData.append("FolderId", parseInt(folderId));

  try {

    const res = await API.post(
      "/Documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    console.log("UPLOAD SUCCESS:", res.data);

    alert("Document uploaded successfully");

    setTitle("");
    setDescription("");
    setFile(null);
    setFolderId("");

  } catch (err) {

    console.error("UPLOAD ERROR:", err.response?.data);

    alert(
      JSON.stringify(err.response?.data?.errors || err.response?.data)
    );

  }

};

  return (

<div className="p-6 max-w-3xl">

<h1 className="text-2xl font-bold mb-6">
Upload Document
</h1>

{/* PROJECT SELECT */}

<select
value={projectId}
onChange={(e)=>setProjectId(e.target.value)}
className="border p-2 w-full mb-4 rounded"
>

<option value="">
Select Project
</option>

{projects.map(project => (

<option key={project.id} value={project.id}>
{project.name}
</option>

))}

</select>

{/* FOLDER SELECT */}

<select
value={folderId}
onChange={(e)=>setFolderId(e.target.value)}
className="border p-2 w-full mb-4 rounded"
>

<option value="">
Select Folder
</option>

{folders.map(folder => (

<option key={folder.id} value={folder.id}>
{folder.name}
</option>

))}

</select>

{/* TITLE */}

<input
type="text"
placeholder="Document Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
className="border p-2 w-full mb-4 rounded"
/>

{/* DESCRIPTION */}

<textarea
placeholder="Description (optional)"
value={description}
onChange={(e)=>setDescription(e.target.value)}
className="border p-2 w-full mb-4 rounded"
/>

{/* DROPZONE */}

<div
{...getRootProps()}
className="border-2 border-dashed border-gray-400 p-10 text-center rounded cursor-pointer"
>

<input {...getInputProps()} />

{isDragActive ? (
<p>Drop the file here...</p>
) : (
<p>Drag & drop file here or click to upload</p>
)}

{file && (
<p className="mt-3 text-green-600">
Selected File: {file.name}
</p>
)}

</div>

<button
onClick={uploadDocument}
className="bg-blue-600 text-white px-6 py-2 rounded mt-4 hover:bg-blue-700"
>

Upload

</button>

</div>

  );

}