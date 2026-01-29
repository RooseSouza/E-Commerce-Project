import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import AddressList from "../components/AddressList";
import RecentOrders from "../components/RecentOrders";
import ProfileSettings from "../components/ProfileSettings";
import EditProfileModal from "../components/EditProfileModal";
import AddAddressModal from "../components/AddAddressModal";

const UserProfile = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [stats, setStats] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);

  /* ✅ FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/users/me/profile`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();

      setUser(data.user);
      setStats(data.stats);
      setAddresses(data.user.addresses || []);

      setOrders(
        data.orders.map((o, i) => {
          const d = new Date(o.createdAt);
          return {
            id: o._id,
            orderName: `Order #${i + 1}`,
            date: `${String(d.getDate()).padStart(2, "0")}/${String(
              d.getMonth() + 1
            ).padStart(2, "0")}/${d.getFullYear()}`,
            amount: o.totalAmount,
            status: o.status,
          };
        })
      );

      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ✅ UPDATE PROFILE */
  const handleSaveProfile = async (updatedData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/api/users/me`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      }
    );

    const data = await res.json();
    if (!res.ok) return { errors: data.errors };

    setUser(data);
    setShowEditModal(false);
  };

  /* ✅ ADD ADDRESS */
 const handleAddAddress = async (addressData) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/api/users/me/address`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(addressData),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return { errors: data.errors || { general: "Failed to add address" } };
    }

    setAddresses(data.addresses);
    setShowAddAddress(false);
    return null;
  } catch (err) {
    return {
      errors: { general: "Server error. Please try again." },
    };
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login", { replace: true });
  };

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-4 border-gray-300 border-t-blue-600 rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">
          Loading your profile...
        </p>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 py-8 px-4 max-w-6xl mx-auto">
        <ProfileHeader user={user} onEditClick={() => setShowEditModal(true)} />
        <ProfileStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={orders} />
            <AddressList
              addresses={addresses}
              onAddNew={() => setShowAddAddress(true)}
            />
          </div>

          <ProfileSettings onLogout={handleLogout} />
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <AddAddressModal
        isOpen={showAddAddress}
        onClose={() => setShowAddAddress(false)}
        onSave={handleAddAddress}
      />

      <Footer />
    </div>
  );
};

export default UserProfile;
