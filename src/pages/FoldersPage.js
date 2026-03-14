import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import deleteIcon from "../assets/delete.png";

export default function FoldersPage() {

  const { projectId } = useParams();
  const navigate = useNavigate();

  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [showRename, setShowRename] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  // ===============================
  // LOAD FOLDERS
  // ===============================
  const loadFolders = useCallback(async () => {

    if (!projectId) return;

    try {

      setLoading(true);

      const res = await API.get(`/Folders/project/${projectId}`);

      setFolders(res.data);

    } catch (err) {

      console.log("Error loading folders:", err);

    } finally {

      setLoading(false);

    }

  }, [projectId]);

  // ===============================
  // LOAD WHEN PROJECT CHANGES
  // ===============================
  useEffect(() => {

    loadFolders();

  }, [loadFolders]);

  // ===============================
  // CREATE FOLDER
  // ===============================
  const createFolder = async () => {

    if (!folderName.trim()) {
      alert("Enter folder name");
      return;
    }

    try {

      await API.post("/Folders", {

        name: folderName,
        projectId: parseInt(projectId),
        parentFolderId: null

      });

      setFolderName("");

      loadFolders();

    } catch (err) {

      console.log("Create folder error:", err);

    }

  };

  // ===============================
  // DELETE FOLDER
  // ===============================
  const deleteFolder = async (id) => {

    if (!window.confirm("Delete this folder?")) return;

    try {

      await API.delete(`/Folders/${id}`);

      loadFolders();

    } catch (err) {

      console.log("Delete folder error:", err);

    }

  };

  // ===============================
  // OPEN RENAME MODAL
  // ===============================
  const openRename = (folder) => {

    setSelectedFolder(folder);
    setNewName(folder.name);
    setShowRename(true);

  };

  // ===============================
  // RENAME FOLDER
  // ===============================
  const renameFolder = async () => {

    if (!newName.trim()) return;

    try {

      await API.put(`/Folders/${selectedFolder.id}`, {
        name: newName
      });

      setShowRename(false);

      loadFolders();

    } catch (err) {

      console.log("Rename folder error:", err);

    }

  };

  // ===============================
  // OPEN FOLDER
  // ===============================
  const openFolder = (folder) => {

    navigate(`/documents/${folder.id}`);

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Folders
      </h1>

      {/* CREATE FOLDER */}

      <div className="flex gap-2 mb-6">

        <input
          type="text"
          placeholder="New Folder Name"
          value={folderName}
          onChange={(e)=>setFolderName(e.target.value)}
          onKeyDown={(e)=>{
            if(e.key === "Enter"){
              createFolder();
            }
          }}
          className="border p-2 rounded w-64"
        />

        <button
          onClick={createFolder}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Folder
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <p className="text-gray-500">Loading folders...</p>
      )}

      {/* FOLDER LIST */}

      <div className="grid grid-cols-3 gap-4">

        {folders.map(folder => (

          <div
            key={folder.id}
            className="bg-white shadow rounded p-4 flex justify-between items-center hover:bg-gray-100"
          >

            <div
              onClick={()=>openFolder(folder)}
              className="cursor-pointer font-medium"
            >
              📁 {folder.name}
            </div>

            <div className="flex gap-3 items-center">

              <button
                onClick={()=>openRename(folder)}
                className="text-blue-500 hover:text-blue-700"
                title="Rename Folder"
              >
                ✏️
              </button>

              <button
                onClick={()=>deleteFolder(folder.id)}
                className="hover:scale-110 transition"
                title="Delete Folder"
              >
                <img
                  src={deleteIcon}
                  alt="delete"
                  className="w-6 h-6"
                />
              </button>

            </div>

          </div>

        ))}

      </div>

      {/* EMPTY STATE */}

      {!loading && folders.length === 0 && (

        <p className="text-gray-500 mt-6">
          No folders created yet.
        </p>

      )}

      {/* RENAME MODAL */}

      {showRename && (

        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

          <div className="bg-white p-6 rounded shadow w-80">

            <h2 className="text-lg font-semibold mb-4">
              Rename Folder
            </h2>

            <input
              type="text"
              value={newName}
              onChange={(e)=>setNewName(e.target.value)}
              className="border p-2 w-full mb-4 rounded"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={()=>setShowRename(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={renameFolder}
                className="px-3 py-1 bg-blue-600 text-white rounded"
              >
                Save
              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}