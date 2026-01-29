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

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: contextUser, clearUser } = useContext(UserContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    memberSince: "",
  });

  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);

  /* ✅ FETCH PROFILE */
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/users/me/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setUser({
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone || "",
        });

        setStats(data.stats);

        const formattedOrders = data.orders.map((order, index) => {
          const d = new Date(order.createdAt);
          const date = `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
          ).padStart(2, "0")}/${d.getFullYear()}`;

          return {
            id: order._id,
            orderName: `Order #${index + 1}`,
            date,
            amount: order.totalAmount,
            status:
              order.status.charAt(0).toUpperCase() + order.status.slice(1),
          };
        });

        setOrders(formattedOrders);
        setAddresses(data.user.addresses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  /* ✅ UPDATE PROFILE */
  const handleSaveProfile = async (updatedData) => {
    try {
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

      if (!res.ok) throw new Error("Update failed");

      const updatedUser = await res.json();

      setUser({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      });

      setShowEditModal(false);
    } catch (err) {
      console.error("Profile update error:", err);
      alert("Failed to update profile");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ProfileHeader user={user} onEditClick={() => setShowEditModal(true)} />
          <ProfileStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentOrders orders={orders} onViewOrder={() => {}} />
              <AddressList addresses={addresses} />
            </div>

            <ProfileSettings onLogout={handleLogout} />
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <Footer />
    </div>
  );
};

export default UserProfile;
