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
import OrderDetailsModal from "../components/OrderDetailsModal";

const UserProfile = () => {
  const navigate = useNavigate();
  const { clearUser } = useContext(UserContext);

  const [user, setUser] = useState({ name: "", email: "", phone: "" });
  const [stats, setStats] = useState({});
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
const [showOrderModal, setShowOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressIndex, setEditingAddressIndex] = useState(null);

  /* ✅ FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/users/me/profile`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();

      setUser(data.user);
      setStats(data.stats);
      setAddresses(data.user.addresses || []);

      setOrders(data.orders); // keep full order objects

      setLoading(false);
    };

    fetchProfile();
  }, []);

  /* ✅ UPDATE PROFILE */
  const handleSaveProfile = async (updatedData) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/users/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    const data = await res.json();
    if (!res.ok) return { errors: data.errors };

    setUser(data);
    setShowEditModal(false);
  };

  /* ✅ ADD / EDIT ADDRESS */
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
          body: JSON.stringify(addressData), // ✅ IMPORTANT FIX
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return { errors: data.errors || { general: "Failed to add address" } };
      }

      setAddresses(data.addresses);
      setShowAddAddress(false);
      return null;
    } catch (err) {
      return { errors: { general: "Server error" } };
    }
  };
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  /* ✅ DELETE ADDRESS */
  const handleDeleteAddress = async (index) => {
    if (!window.confirm("Are you sure you want to delete this address")) return;

    try {
      const token = localStorage.getItem("token");
      const addressId = addresses[index]._id;

      const res = await fetch(
        `${import.meta.env.VITE_API_BASE}/api/users/me/address/${addressId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Delete failed");
        return;
      }

      setAddresses(data.addresses);
    } catch (err) {
      console.error("Server error");
    }
  };

  /* ✅ EDIT ADDRESS */
  const handleEditAddress = (index) => {
    setEditingAddressIndex(index);
    setShowAddAddress(true);
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
          <p className="text-gray-600 font-medium">Loading your profile...</p>
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
            <RecentOrders orders={orders} onViewOrder={handleViewOrder} />
            <AddressList
              addresses={addresses}
              onAddNew={() => {
                setEditingAddressIndex(null);
                setShowAddAddress(true);
              }}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
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
        onClose={() => {
          setShowAddAddress(false);
          setEditingAddressIndex(null);
        }}
        onSave={handleAddAddress}
        initialData={
          editingAddressIndex !== null ? addresses[editingAddressIndex] : null
        }
      />
{showOrderModal && (
  <OrderDetailsModal
  order={selectedOrder}
  addresses={addresses}
  onClose={() => {
    setShowOrderModal(false);
    setSelectedOrder(null);
  }}
/>
)}

      

      <Footer />
    </div>
  );
};

export default UserProfile;
