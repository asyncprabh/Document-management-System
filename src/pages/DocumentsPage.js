import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";
import DragUpload from "../components/DragUpload";

export default function DocumentsPage() {

  const { folderId } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [file, setFile] = useState(null);
  const [role, setRole] = useState(null);

  // Decode role
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    try {

      const decoded = jwtDecode(token);

      setRole(
        decoded.role ||
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
      );

    } catch {

      console.log("Invalid token");

    }

  }, []);

  // Load documents
  const loadDocuments = useCallback(async () => {

    if (!folderId) return;

    try {

      setLoading(true);

      const res = await API.get(`/documents/folder/${folderId}`);

      setDocuments(res.data);

    } catch (err) {

      console.error("Load documents error:", err);

    } finally {

      setLoading(false);

    }

  }, [folderId]);

  useEffect(() => {

    loadDocuments();

  }, [loadDocuments]);

  // Upload File
  const uploadFile = async () => {

    if (!file) {

      alert("Select file");
      return;

    }

    try {

      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folderId", parseInt(folderId));
      formData.append("title", file.name);

      await API.post("/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setFile(null);

      if (fileInputRef.current) {

        fileInputRef.current.value = "";

      }

      loadDocuments();

    } catch (err) {

      console.error("Upload failed:", err.response?.data || err);
      alert("Upload failed");

    } finally {

      setUploading(false);

    }

  };

  // Preview
  const previewFile = (id) => navigate(`/preview/${id}`);

  // Versions
  const viewVersions = (id) => navigate(`/versions/${id}`);

  // Download
  const downloadFile = async (id, name) => {

    try {

      const res = await API.get(`/documents/download/${id}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.download = name;

      document.body.appendChild(link);
      link.click();
      link.remove();

    } catch (err) {

      console.error("Download failed", err);

    }

  };

  // ⭐ SHARE FIX (Open PDF in Browser)
  const shareDocument = async (id) => {

  const url = `https://localhost:7208/api/documents/public/${id}`;

  await navigator.clipboard.writeText(url);

  alert("Share link copied");

};

  // Lock
  const lockDocument = async (id) => {

    try {

      await API.post(`/documents/lock/${id}`);
      loadDocuments();

    } catch {

      alert("Lock failed");

    }

  };

  // Unlock
  const unlockDocument = async (id) => {

    try {

      await API.post(`/documents/unlock/${id}`);
      loadDocuments();

    } catch {

      alert("Unlock failed");

    }

  };

  // Rename
  const renameFile = async (id, oldName) => {

    const doc = documents.find(d => d.id === id);

    if (doc?.isLocked) {

      alert("Document locked");
      return;

    }

    const newName = prompt("Rename document", oldName);

    if (!newName || newName === oldName) return;

    try {

      await API.put(`/documents/rename/${id}`, {
        title: newName
      });

      alert("Document renamed successfully");

      loadDocuments();

    } catch (err) {

      console.error("Rename failed:", err.response?.data || err);
      alert("Rename failed");

    }

  };

  // Delete
  const deleteFile = async (id) => {

    const doc = documents.find(d => d.id === id);

    if (doc?.isLocked) {

      alert("Document locked");
      return;

    }

    if (role !== "Admin") {

      alert("Admin only");
      return;

    }

    if (!window.confirm("Delete document?")) return;

    try {

      await API.delete(`/documents/${id}`);

      setDocuments(prev => prev.filter(d => d.id !== id));

    } catch {

      alert("Delete failed");

    }

  };

  // Search
  const filteredDocs = useMemo(() => {

    return documents.filter(doc =>
      (doc.title || "").toLowerCase().includes(search.toLowerCase())
    );

  }, [documents, search]);

  // File icons
  const getIcon = (name) => {

    const ext = name?.split(".").pop()?.toLowerCase();

    if (ext === "pdf") return "📕";
    if (["png","jpg","jpeg"].includes(ext)) return "🖼️";
    if (["doc","docx"].includes(ext)) return "📘";
    if (["xls","xlsx"].includes(ext)) return "📗";

    return "📄";

  };

  if (loading) {

    return <div className="p-6">Loading documents...</div>;

  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">Documents</h1>

      {/* Upload */}
      <div className="flex gap-2 mb-6">

        <input
          ref={fileInputRef}
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
          className="border p-2 rounded"
        />

        <button
          onClick={uploadFile}
          disabled={!file || uploading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>

      </div>

      <DragUpload folderId={folderId} reload={loadDocuments}/>

      {/* Search */}
      <input
        type="text"
        placeholder="Search documents..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="border p-2 w-full rounded mb-6"
      />

      {filteredDocs.map(doc => (

        <div key={doc.id} className="flex justify-between items-center p-4 border-b">

          <div className="flex items-center gap-3">
            <span className="text-xl">{getIcon(doc.title)}</span>
            {doc.title}
          </div>

          <div className="flex gap-3 text-sm">

            <button onClick={()=>previewFile(doc.id)} className="text-green-600">Preview</button>

            <button onClick={()=>downloadFile(doc.id,doc.title)} className="text-blue-600">Download</button>

            <button onClick={()=>viewVersions(doc.id)} className="text-purple-600">Versions</button>

            {!doc.isLocked && (
              <button onClick={()=>lockDocument(doc.id)} className="text-orange-600">Lock</button>
            )}

            {doc.isLocked && (
              <button onClick={()=>unlockDocument(doc.id)} className="text-orange-600">Unlock</button>
            )}

            <button onClick={()=>shareDocument(doc.id)} className="text-indigo-600">Share</button>

            <button onClick={()=>renameFile(doc.id,doc.title)} className="text-yellow-600">Rename</button>

            {role==="Admin" && (
              <button onClick={()=>deleteFile(doc.id)} className="text-red-600">Delete</button>
            )}

          </div>

        </div>

      ))}

    </div>

  );

}