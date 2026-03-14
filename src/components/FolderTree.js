import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function FolderTree({ folders }) {

  const navigate = useNavigate();
  const [open, setOpen] = useState({});

  const toggleFolder = (id) => {
    setOpen(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const renderTree = (nodes) => {

    return nodes.map((node) => (

      <div key={node.id} className="ml-2">

        <div className="flex items-center gap-2 hover:bg-blue-50 p-2 rounded cursor-pointer transition">

          {/* Expand / Collapse */}

          {node.children && node.children.length > 0 ? (

            <span
              onClick={() => toggleFolder(node.id)}
              className="text-sm"
            >
              {open[node.id] ? "▼" : "▶"}
            </span>

          ) : (

            <span className="w-3"></span>

          )}

          {/* Folder Icon */}

          <span>
            {open[node.id] ? "📂" : "📁"}
          </span>

          {/* Folder Name */}

          <span
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/documents/${node.id}`);
            }}
            className="font-medium"
          >
            {node.name}
          </span>

        </div>

        {/* Children */}

        {open[node.id] && node.children && node.children.length > 0 && (

          <div className="ml-6 border-l pl-2">

            {renderTree(node.children)}

          </div>

        )}

      </div>

    ));

  };

  return (

    <div className="bg-white p-4 rounded shadow">

      {folders && folders.length > 0 ? (
        renderTree(folders)
      ) : (
        <p className="text-gray-500">
          No folders available
        </p>
      )}

    </div>

  );

}