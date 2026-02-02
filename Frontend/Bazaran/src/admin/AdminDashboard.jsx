import { useEffect, useState } from "react";
import axios from "axios";
import AdminDashboardCard from "../components/AdminDashboardCard";
import {
  Users,
  Store,
  Package,
  ShoppingCart,
} from "lucide-react";

const API = import.meta.env.VITE_API_BASE;

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load admin stats", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">

      {/* 🔹 Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500">
          Quick summary of platform activity
        </p>
      </div>

      {/* 🔹 Loading State */}
      {!stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border p-6 h-24 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* 🔹 Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminDashboardCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={<Users className="text-blue-600" />}
            bg="bg-blue-100"
          />

          <AdminDashboardCard
            title="Total Vendors"
            value={stats.totalVendors || 0}
            icon={<Store className="text-orange-600" />}
            bg="bg-orange-100"
          />

          <AdminDashboardCard
            title="Total Products"
            value={stats.totalProducts || 0}
            icon={<Package className="text-green-600" />}
            bg="bg-green-100"
          />

          <AdminDashboardCard
            title="Total Orders"
            value={stats.totalOrders || 0}
            icon={<ShoppingCart className="text-purple-600" />}
            bg="bg-purple-100"
          />
        </div>
      )}

      {/* 🔹 Footer Info */}
      <p className="text-xs text-gray-400">
      </p>
    </div>
  );
};

export default AdminDashboard;
