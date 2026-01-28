import React from 'react';

const ProfileStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {stats.totalOrders || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📦</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Spent</p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              ₹{stats.totalSpent || 0}
            </p>
          </div>
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">💰</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Member Since</p>
            <p className="text-xl font-bold text-gray-800 mt-2">
              {stats.memberSince || 'N/A'}
            </p>
          </div>
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
