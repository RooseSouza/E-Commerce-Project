const cloudinary = require("cloudinary");

// configure the V2 instance (this is what multer-storage-cloudinary expects)
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // use exact name from env
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
