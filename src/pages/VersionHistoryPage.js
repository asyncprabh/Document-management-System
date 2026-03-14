import { useEffect, useState, useCallback } from "react";
export default function VersionHistoryPage() {

  const { documentId } = useParams();

  const [versions, setVersions] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
  loadVersions();
}, [documentId]);

  const loadVersions = useCallback(async () => {

  try {
    const res = await API.get(`/Documents/versions/${documentId}`);
    setVersions(res.data);
  } catch (err) {
    console.error(err);
  }

}, [documentId]);



  const uploadVersion = async () => {

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      await API.post(`/Documents/upload-version/${documentId}`, formData);

      loadVersions();

    } catch (err) {

      console.error(err);

    }

  };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Document Version History
      </h1>

      {/* Upload New Version */}

      <div className="mb-6 flex gap-3">

        <input
          type="file"
          onChange={(e)=>setFile(e.target.files[0])}
        />

        <button
          onClick={uploadVersion}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload New Version
        </button>

      </div>

      {/* Version List */}

      <div className="bg-white shadow rounded">

        {versions.map(v => (

          <div
            key={v.id}
            className="flex justify-between p-4 border-b"
          >

            <div>

              <p className="font-medium">
                Version {v.versionNumber}
              </p>

              <p className="text-sm text-gray-500">
                Uploaded by {v.uploadedBy}
              </p>

            </div>

            <div>

              <p className="text-sm text-gray-500">
                {new Date(v.createdAt).toLocaleString()}
              </p>

              <a
                href={`/api/Documents/download/${v.id}`}
                className="text-blue-600"
              >
                Download
              </a>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}