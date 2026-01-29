import React, { useState, useEffect } from "react";

const AddAddressModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        phone: "",
        houseNumber: "",
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: null }));
  };

  const validate = () => {
    const e = {};
    if (!formData.name.trim()) e.name = "Name is required";
    if (!/^[0-9]{10}$/.test(formData.phone)) e.phone = "Phone must be 10 digits";
    if (!formData.houseNumber.trim()) e.houseNumber = "House number required";
    if (!formData.street.trim()) e.street = "Street required";
    if (!formData.city.trim()) e.city = "City required";
    if (!formData.state.trim()) e.state = "State required";
    if (!/^[0-9]{6}$/.test(formData.zip)) e.zip = "Zip must be 6 digits";
    if (!formData.country.trim()) e.country = "Country required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await onSave(formData);
    if (result?.errors) setErrors(result.errors);
  };

  const fields = [
    ["name", "Full Name"],
    ["phone", "Phone"],
    ["houseNumber", "House Number"],
    ["street", "Street"],
    ["city", "City"],
    ["state", "State"],
    ["zip", "Zip Code"],
    ["country", "Country"],
  ];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add Address</h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          {fields.map(([name, label]) => (
            <div key={name}>
              <label className="block text-sm text-gray-600">{label}</label>
              <input
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              {errors[name] && (
                <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
              )}
            </div>
          ))}

          {errors.general && (
            <p className="text-sm text-red-600">{errors.general}</p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded-lg">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              Add Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAddressModal;
