const multer = require("multer");
const multerStorageCloudinary = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

let storage;

// Handle different versions of multer-storage-cloudinary
if (multerStorageCloudinary.CloudinaryStorage) {
  // Version 4.x
  storage = new multerStorageCloudinary.CloudinaryStorage({
    cloudinary,
    params: {
      folder: "vendor_products",
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    },
  });
} else {
  // Version 3.x or older (Fallback)
  storage = multerStorageCloudinary({
    cloudinary,
    folder: "vendor_products",
    allowedFormats: ["jpg", "png", "jpeg", "webp"],
  });
}

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"), false);
    } else {
      cb(null, true);
    }
  }
});

module.exports = upload;
