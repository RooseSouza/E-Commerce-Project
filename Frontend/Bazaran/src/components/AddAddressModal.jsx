import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  houseNumber: "",
  street: "",
  city: "",
  state: "",
  zip: "",
  country: "",
  phone: "",
};

const AddAddressModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData); // EDIT MODE
    } else {
      setFormData(emptyForm); // ADD MODE
    }
  }, [initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-lg p-6 relative">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? "Edit Address" : "Add Address"}
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3">
          {Object.keys(emptyForm).map((field) => (
            <input
              key={field}
              type="text"
              name={field}
              placeholder={field.replace(/([A-Z])/g, " $1")}
              value={formData[field]}
              onChange={handleChange}
              className="border rounded px-3 py-2 text-sm"
              required
            />
          ))}

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
            >
              {initialData ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
