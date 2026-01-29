import React from "react";

const AddressList = ({ addresses, onEdit, onDelete, onAddNew }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Saved Addresses</h2>
        <button
          onClick={onAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors text-sm"
        >
          + Add Address
        </button>
      </div>

      {addresses && addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative"
            >
              {/* Name */}
              {address.name && (
                <p className="font-semibold text-gray-800 mb-1">
                  {address.name}
                </p>
              )}

              {/* Full Address */}
              <p className="text-gray-700 text-sm">
                {address.houseNumber}, {address.street}
              </p>
              <p className="text-gray-700 text-sm">
                {address.city}, {address.state} – {address.zip}
              </p>
              <p className="text-gray-700 text-sm mb-2">{address.country}</p>
              <p className="text-gray-800 text-sm font-medium">
                📞 {address.phone}
              </p>

              {/* Actions */}
              <div className="flex gap-3 text-sm">
                <button
                  onClick={() => onEdit(index)}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(index)}
                  className="text-red-600 hover:text-red-700 font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No addresses saved yet</p>
      )}
    </div>
  );
};

export default AddressList;
