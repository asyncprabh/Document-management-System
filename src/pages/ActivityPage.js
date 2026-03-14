import { useEffect, useState } from "react";
import API from "../services/api";

export default function ActivityPage() {

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const res = await API.get("/Documents/activity");
      setLogs(res.data);
    } catch (err) {
      console.error("Error loading activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (action) => {
    if (action?.includes("Upload")) return "📤";
    if (action?.includes("Delete")) return "🗑";
    if (action?.includes("Download")) return "⬇";
    if (action?.includes("Preview")) return "👁";
    return "📄";
  };

  const getColor = (action) => {
    if (action?.includes("Upload")) return "bg-green-100 text-green-700";
    if (action?.includes("Delete")) return "bg-red-100 text-red-700";
    if (action?.includes("Download")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading activity...
      </div>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Activity Logs
      </h1>

      <div className="bg-white shadow rounded-lg overflow-x-auto">

        {logs.length === 0 ? (

          <div className="p-6 text-gray-500 text-center">
            No activity found
          </div>

        ) : (

          <table className="w-full text-sm">

            <thead className="bg-gray-100 text-gray-700">

              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Document</th>
                <th className="p-4 text-left">Time</th>
              </tr>

            </thead>

            <tbody>

              {logs.map((log) => (

                <tr key={log.id} className="border-t hover:bg-gray-50 transition">

                  <td className="p-4 text-gray-700">
                    {log.userName || "System"}
                  </td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getColor(log.action)}`}>
                      {getIcon(log.action)} {log.action}
                    </span>

                  </td>

                  <td className="p-4 font-medium text-gray-700">
                    {log.documentName || "-"}
                  </td>

                  <td className="p-4 text-gray-500">
                    {formatTime(log.createdAt)}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </div>
  );
}