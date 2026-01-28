import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/userContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileHeader from '../components/ProfileHeader';
import ProfileStats from '../components/ProfileStats';
import AddressList from '../components/AddressList';
import RecentOrders from '../components/RecentOrders';
import ProfileSettings from '../components/ProfileSettings';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: contextUser, clearUser } = useContext(UserContext);

  // Mock user data - replace with actual context/API data
  const [user, setUser] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210'
  });

  useEffect(() => {
    if (contextUser) {
      const names = contextUser.name ? contextUser.name.split(' ') : ['User'];
      setUser(prev => ({
        ...prev,
        firstName: names[0],
        lastName: names.slice(1).join(' ') || '',
        email: contextUser.email,
        phone: contextUser.phone || prev.phone
      }));
    }
  }, [contextUser]);

  const [stats] = useState({
    totalOrders: 12,
    totalSpent: 45250,
    memberSince: '2024'
  });

  const [addresses, setAddresses] = useState([
    {
      type: 'Home',
      street: '123 Main Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560001',
      country: 'India'
    },
    {
      type: 'Work',
      street: '456 Business Plaza',
      city: 'Bangalore',
      state: 'Karnataka',
      zipCode: '560034',
      country: 'India'
    }
  ]);

  const [orders] = useState([
    {
      id: 'ORD001',
      date: '2026-01-20',
      amount: 5999,
      status: 'Delivered'
    },
    {
      id: 'ORD002',
      date: '2026-01-18',
      amount: 2450,
      status: 'Processing'
    },
    {
      id: 'ORD003',
      date: '2026-01-15',
      amount: 8750,
      status: 'Delivered'
    },
    {
      id: 'ORD004',
      date: '2026-01-10',
      amount: 3200,
      status: 'Cancelled'
    },
    {
      id: 'ORD005',
      date: '2026-01-05',
      amount: 6100,
      status: 'Delivered'
    }
  ]);

  const handleEditProfile = () => {
    alert('Edit profile modal would open here');
  };

  const handleEditAddress = (index) => {
    alert(`Edit address ${index} would open here`);
  };

  const handleDeleteAddress = (index) => {
    setAddresses(addresses.filter((_, i) => i !== index));
  };

  const handleAddAddress = () => {
    alert('Add address modal would open here');
  };

  const handleViewOrder = (orderId) => {
    alert(`View order ${orderId} details`);
  };

  const handleChangePassword = () => {
    alert('Change password modal would open here');
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion logic would be executed here');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <ProfileHeader user={user} onEditClick={handleEditProfile} />

        {/* Statistics */}
        <ProfileStats stats={stats} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Recent Orders */}
            <RecentOrders orders={orders} onViewOrder={handleViewOrder} />

            {/* Addresses */}
            <AddressList 
              addresses={addresses} 
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              onAddNew={handleAddAddress}
            />
          </div>

          {/* Sidebar - Settings */}
          <div>
            <ProfileSettings 
              onChangePassword={handleChangePassword}
              onLogout={handleLogout}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
