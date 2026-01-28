import React, { useState } from 'react';

const ProfileHeader = ({ user, onEditClick }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
          <span className="text-4xl text-white font-bold">
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600 mb-1">{user.email}</p>
          <p className="text-gray-600 mb-4">{user.phone || 'Not provided'}</p>
          <button
            onClick={onEditClick}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
