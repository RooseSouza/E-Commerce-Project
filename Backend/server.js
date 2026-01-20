const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const category = require("./models/category");


dotenv.config();

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));




// Predefined Local Market Categories
const predefinedCategories = [
  { name: "Dairy", description: "Milk, cheese, butter, yogurt" },
  { name: "Fruits", description: "Fresh and seasonal fruits" },
  { name: "Vegetables", description: "Fresh vegetables" },
  { name: "Bakery", description: "Bread, cakes, pastries" },
  { name: "Beverages", description: "Juices, soft drinks, tea, coffee" },
  { name: "Snacks", description: "Chips, namkeen, chocolates" },
  { name: "Meat & Poultry", description: "Chicken, mutton, fish, eggs" },
  { name: "Seafood", description: "Fresh and frozen seafood" },
  { name: "Grains & Pulses", description: "Rice, wheat, lentils, beans" },
  { name: "Spices & Condiments", description: "Salt, spices, sauces, pickles" },
  { name: "Personal Care", description: "Soap, shampoo, toothpaste, skincare" },
  { name: "Household Items", description: "Cleaning products, kitchen supplies" },
  { name: "Frozen Foods", description: "Frozen vegetables, ready-to-eat items" },
  { name: "Organic Products", description: "Organic fruits, vegetables, and grains" },
  { name: "Snacks & Sweets", description: "Mithai, biscuits, chocolates" }
];

// Function to seed categories
const seedCategories = async () => {
  try {
    for (let cat of predefinedCategories) {
      const exists = await category.findOne({ name: cat.name });
      if (!exists) {
        await new category(cat).save();
        console.log(`category "${cat.name}" added`);
      }
    }
  } catch (error) {
    console.error("Error seeding categories:", error.message);
  }
};


const startServer = async () => {
  await connectDB();
  await seedCategories();
}

/* Seed categories after DB connection
connectDB().then(() => seedCategories());*/

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

startServer();
