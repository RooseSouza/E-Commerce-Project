import React, { useState, useEffect } from "react";

const UpdatePasswordModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  /* 🔄 Reset form */
  const resetForm = () => {
    setFormData({
      oldPassword: "",
      newPassword: "",
    });
    setErrors({});
    setServerError("");
  };

  /* Clear when modal closes */
  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({});
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.oldPassword) {
      newErrors.oldPassword = "Old password is required";
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
      newErrors.newPassword = "New password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const result = await onSave(formData);

    if (result?.error) {
      setServerError(result.error);
      return;
    }

    // ✅ SUCCESS
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">Update Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Old Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Old Password
            </label>
            <input
              type="password"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.oldPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.oldPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.newPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
            )}
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdatePasswordModal;
