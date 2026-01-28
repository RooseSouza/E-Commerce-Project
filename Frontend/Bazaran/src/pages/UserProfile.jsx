import React, { useEffect, useState } from "react";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import AddressList from "../components/AddressList";
import RecentOrders from "../components/RecentOrders";
import ProfileSettings from "../components/ProfileSettings";

const UserProfile = () => {
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

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `${import.meta.env.VITE_API_BASE}/api/users/me/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();

        /* ✅ USER */
        const fallbackPhone =
          data.user.phone || data.orders?.[0]?.address?.phone || "Not provided";

        setUser({
          name: data.user.name || "",
          email: data.user.email || "",
          phone: fallbackPhone,
        });

        /* ✅ STATS */
        setStats({
          totalOrders: data.stats.totalOrders,
          totalSpent: data.stats.totalSpent,
          memberSince: data.stats.memberSince,
        });

        /* ✅ ORDERS */
        const formattedOrders = data.orders.map((order) => ({
          id: order._id,
          date: new Date(order.createdAt).toISOString().split("T")[0],
          amount: order.totalAmount,
          status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
          phone: order.address?.phone || "Not provided",
        }));

        setOrders(formattedOrders);

        /* ✅ ADDRESSES (WITH PHONE) */
        const extractedAddresses = data.orders
          .map((order) => {
            if (!order.address) return null;

            return {
              ...order.address,
              phone: order.address.phone || "Not provided",
            };
          })
          .filter(Boolean);

        /* ✅ REMOVE DUPLICATES */
        const uniqueAddresses = Array.from(
          new Map(
            extractedAddresses.map((addr) => [
              `${addr.street}-${addr.zip}-${addr.phone}`,
              addr,
            ]),
          ).values(),
        );

        setAddresses(uniqueAddresses);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => alert("Edit profile modal would open here");
  const handleEditAddress = (index) => alert(`Edit address ${index}`);
  const handleDeleteAddress = (index) =>
    setAddresses(addresses.filter((_, i) => i !== index));
  const handleAddAddress = () => alert("Add address modal");
  const handleViewOrder = (id) => alert(`View order ${id}`);
  const handleChangePassword = () => alert("Change password");
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("Logged out");
  };
  const handleDeleteAccount = () => alert("Delete account");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <ProfileHeader user={user} onEditClick={handleEditProfile} />
        <ProfileStats stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentOrders orders={orders} onViewOrder={handleViewOrder} />
            <AddressList
              addresses={addresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onAddNew={handleAddAddress}
            />
          </div>

          <ProfileSettings
            onChangePassword={handleChangePassword}
            onLogout={handleLogout}
            onDeleteAccount={handleDeleteAccount}
          />
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
