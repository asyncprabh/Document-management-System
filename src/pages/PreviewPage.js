import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

export default function PreviewPage() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [fileUrl, setFileUrl] = useState(null);

  useEffect(() => {

    const loadFile = async () => {

      try {

        const res = await API.get(`/Documents/download/${id}`, {
          responseType: "blob"
        });

        const url = window.URL.createObjectURL(res.data);

        setFileUrl(url);

      } catch (err) {

        console.error("Preview error:", err);

      }

    };

    loadFile();

  }, [id]);

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Document Preview
        </h1>

        <div className="flex gap-2">

          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Back
          </button>

          {fileUrl && (
            <a
              href={fileUrl}
              download
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download
            </a>
          )}

        </div>

      </div>

      <div className="border rounded shadow h-[800px]">

        {fileUrl ? (

          <iframe
            src={fileUrl}
            title="Document Preview"
            width="100%"
            height="100%"
          />

        ) : (

          <div className="flex items-center justify-center h-full">
            Loading preview...
          </div>

        )}

      </div>

    </div>

  );

}