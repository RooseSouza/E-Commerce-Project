const express = require("express");
const router = express.Router();

const { getAllCategories } = require("../controllers/categoryController");

// GET all categories (for dropdowns)
router.get("/", getAllCategories);

module.exports = router;
