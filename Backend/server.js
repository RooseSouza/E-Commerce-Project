const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const cors = require("cors");
const Category = require("./models/category");
const adminRoutes = require("./routes/AdminRoutes");


dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://bazaran.vercel.app",
];

app.use(cors({
  origin: function (origin, callback) {
      // allow requests with no origin (Postman, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
 
  credentials: true
}));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/admin", require("./routes/AdminRoutes"));






// Predefined Local Market Categories
const predefinedCategories = [
  { name: "Fresh Produce", description: "Farm fresh fruits and vegetables" },
  { name: "Spices & Pantry", description: "Salt, spices, sauces, pickles" },
  { name: "Goan Delicacies", description: "Traditional Goan food products" },  
  { name: "Handicraft and Arts", description: "Handmade crafts and artwork" },
  { name: "Home Decors", description: "Decorative items for home" },
  { name: "Fashion", description: "Clothing and fashion accessories" },
  { name: "Metal and Wood", description: "Metal and wooden handmade products" },
  { name: "Wellness and Organic", description: "Wellness, ayurvedic and organic items" }
];


// Function to seed categories
const seedCategories = async () => {
  try {
    for (let cat of predefinedCategories) {
      const exists = await Category.findOne({ name: cat.name });
      if (!exists) {
        await new Category(cat).save();
        console.log(`category "${cat.name}" added`);
      }
    }
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};

connectDB().then(() => {
  seedCategories();
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
