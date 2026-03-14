import { useEffect, useState } from "react";
import API from "../services/api";

export default function DashboardPage() {

  const [stats, setStats] = useState(null);
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      const statsRes = await API.get("/Dashboard/stats");
      const activityRes = await API.get("/Documents/activity");

      setStats(statsRes.data);
      setActivity(activityRes.data);

    } catch (err) {

      console.error("Dashboard load error:", err);

    } finally {

      setLoading(false);

    }

  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Dashboard
      </h1>

      {/* Stats Cards */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Projects
          </h2>

          <p className="text-3xl font-bold">
            {stats?.totalProjects || 0}
          </p>

        </div>

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Folders
          </h2>

          <p className="text-3xl font-bold">
            {stats?.totalFolders || 0}
          </p>

        </div>

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Documents
          </h2>

          <p className="text-3xl font-bold">
            {stats?.totalDocuments || 0}
          </p>

        </div>

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Locked Documents
          </h2>

          <p className="text-3xl font-bold">
            {stats?.lockedDocuments || 0}
          </p>

        </div>

      </div>

      {/* Manhour Stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Planned ManHours
          </h2>

          <p className="text-3xl font-bold">
            {stats?.plannedMH || 0}
          </p>

        </div>

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Actual ManHours
          </h2>

          <p className="text-3xl font-bold">
            {stats?.actualMH || 0}
          </p>

        </div>

        <div className="bg-white shadow rounded p-6">

          <h2 className="text-gray-500 text-sm">
            Progress
          </h2>

          <p className="text-3xl font-bold">
            {stats?.progress || 0}%
          </p>

        </div>

      </div>

      {/* Recent Activity */}

      <div className="bg-white shadow rounded p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Activity
        </h2>

        {activity.length === 0 ? (

          <p className="text-gray-500">
            No recent activity
          </p>

        ) : (

          <ul className="space-y-2">

            {activity.slice(0, 5).map(log => (

              <li key={log.id} className="text-gray-700">

                {log.action} - 
                <span className="font-medium">
                  {" "}{log.documentName}
                </span>

              </li>

            ))}

          </ul>

        )}

      </div>

    </div>

  );

}