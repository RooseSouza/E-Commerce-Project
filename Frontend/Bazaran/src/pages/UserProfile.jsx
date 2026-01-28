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

  /* ✅ CONTEXT USER (fallback only) */
  useEffect(() => {
    if (contextUser) {
      setUser(prev => ({
        ...prev,
        name: contextUser.name || prev.name,
        email: contextUser.email || prev.email,
        phone: contextUser.phone || prev.phone,
      }));
    }
  }, [contextUser]);

  /* ✅ API DATA (source of truth) */
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
          }
        );

        if (!response.ok) throw new Error("Failed to fetch profile");

        const data = await response.json();

        /* ✅ USER */
        const fallbackPhone =
          data.user.phone ||
          data.orders?.[0]?.address?.phone ||
          "Not provided";

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
        const formattedOrders = data.orders.map(order => ({
          id: order._id,
          date: new Date(order.createdAt).toISOString().split("T")[0],
          amount: order.totalAmount,
          status:
            order.status.charAt(0).toUpperCase() +
            order.status.slice(1),
        }));

        setOrders(formattedOrders);

        /* ✅ ADDRESSES */
        const extractedAddresses = data.orders
          .map(order =>
            order.address
              ? { ...order.address, phone: order.address.phone || "Not provided" }
              : null
          )
          .filter(Boolean);

        const uniqueAddresses = Array.from(
          new Map(
            extractedAddresses.map(addr => [
              `${addr.street}-${addr.zip}-${addr.phone}`,
              addr,
            ])
          ).values()
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
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
          <ProfileHeader user={user} />
          <ProfileStats stats={stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentOrders orders={orders} />
              <AddressList addresses={addresses} />
            </div>

            <ProfileSettings
              onLogout={handleLogout}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UserProfile;
