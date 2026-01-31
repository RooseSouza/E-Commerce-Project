import { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE;

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios.get(`${API}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setStats(res.data));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-500 capitalize">{key}</h3>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
