import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboardCard from "../components/AdminDashboardCard";
import { Users, Store, Package } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE;

const AdminDashboard = () => {
  const [range, setRange] = useState("week");
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchStats();
  }, [range]);

  const fetchStats = async () => {
    try {
      const res = await axios.get(
        `${API_BASE}/api/admin/stats?range=${range}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStats(res.data);
    } catch (err) {
      console.error("Stats error", err);
    }
  };

  const getTitle = (base) => {
    if (range === "day") return `${base} Registered Today`;
    if (range === "week") return `${base} Registered This Week`;
    if (range === "month") return `${base} Registered This Month`;
    return ` ${base}`;
  };

  if (!stats) {
    return (
      <div className="text-center text-gray-500 py-10">
        Loading statistics...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Dashboard Overview</h1>

        <div className="flex bg-white rounded-lg shadow p-1 gap-1">
          {["day", "week", "month", "total"].map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-4 py-1.5 text-sm rounded-md transition
                ${
                  range === r
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AdminDashboardCard
          title={getTitle(" Total Users")}
          value={stats.users}
          icon={<Users size={24} />}
          bg="from-blue-500 to-blue-600"
        />

        <AdminDashboardCard
          title={getTitle(" Total Sellers")}
          value={stats.vendors}
          icon={<Store size={24} />}
          bg="from-purple-500 to-purple-600"
        />

        <AdminDashboardCard
          title={getTitle(" Total Products")}
          value={stats.products}
          icon={<Package size={24} />}
          bg="from-green-500 to-green-600"
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
