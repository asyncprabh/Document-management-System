import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ProjectsPage() {

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ===============================
  // LOAD PROJECTS
  // ===============================
  const loadProjects = async () => {

    try {

      setLoading(true);

      const res = await API.get("/Projects");

      console.log("Projects:", res.data);

      setProjects(res.data);

    } catch (err) {

      console.log("Error loading projects:", err);

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    loadProjects();

  }, []);

  // ===============================
  // CREATE PROJECT
  // ===============================
  const createProject = async () => {

    if (!name.trim()) return;

    try {

      await API.post("/Projects", { name });

      setName("");

      loadProjects();

    } catch (err) {

      console.log("Create project error:", err);

    }

  };

  // ===============================
  // UPDATE PROJECT
  // ===============================
  const updateProject = async () => {

    if (!name.trim()) return;

    try {

      await API.put(`/Projects/${editingId}`, { name });

      setEditingId(null);
      setName("");

      loadProjects();

    } catch (err) {

      console.log("Update project error:", err);

    }

  };

  // ===============================
  // DELETE PROJECT
  // ===============================
  const deleteProject = async (id) => {

    const confirmDelete = window.confirm("Delete this project?");

    if (!confirmDelete) return;

    try {

      await API.delete(`/Projects/${id}`);

      loadProjects();

    } catch (err) {

      console.log("Delete project error:", err);

    }

  };

  // ===============================
  // START EDIT
  // ===============================
  const startEdit = (project) => {

    setEditingId(project.id);

    setName(project.name);

  };

  // ===============================
  // OPEN PROJECT
  // ===============================
  const openProject = (project) => {

    console.log("Opening project:", project.id);

    // store projectId globally
    localStorage.setItem("projectId", project.id);

    // go to folder explorer
    navigate(`/folders/${project.id}`);

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Projects
      </h1>

      {/* CREATE / UPDATE */}

      <div className="flex gap-2 mb-6">

        <input
          type="text"
          placeholder="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {

            if (e.key === "Enter") {

              editingId ? updateProject() : createProject();

            }

          }}
          className="border p-2 rounded w-64"
        />

        {editingId ? (

          <button
            onClick={updateProject}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Update
          </button>

        ) : (

          <button
            onClick={createProject}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Create
          </button>

        )}

      </div>

      {/* LOADING */}

      {loading && (

        <p className="text-gray-500">Loading projects...</p>

      )}

      {/* EMPTY STATE */}

      {!loading && projects.length === 0 && (

        <p className="text-gray-500">
          No projects created yet.
        </p>

      )}

      {/* PROJECT LIST */}

      <div className="grid grid-cols-3 gap-4">

        {projects.map((project) => (

          <div
            key={project.id}
            onDoubleClick={() => openProject(project)}
            className="bg-white shadow rounded p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition"
          >

            <div className="flex items-center gap-2">

              📁 <span className="font-medium">{project.name}</span>

            </div>

            <div className="flex gap-2">

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startEdit(project);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}