import React from 'react';

const ProfileSettings = ({ onChangePassword, onLogout, onDeleteAccount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Settings</h2>

      <div className="space-y-4">
        <button
          onClick={onChangePassword}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-gray-800">Change Password</p>
            <p className="text-gray-600 text-sm">Update your password for security</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-gray-800">Logout</p>
            <p className="text-gray-600 text-sm">Sign out of your account</p>
          </div>
          <span className="text-gray-400">→</span>
        </button>

        <button
          onClick={onDeleteAccount}
          className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
        >
          <div className="text-left">
            <p className="font-medium text-red-600">Delete Account</p>
            <p className="text-red-500 text-sm">Permanently delete your account</p>
          </div>
          <span className="text-red-400">→</span>
        </button>
      </div>
    </div>
  );
};

export default ProfileSettings;
