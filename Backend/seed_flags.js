const mongoose = require("mongoose");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const Product = require("./models/product");
const Category = require("./models/category");
const User = require("./models/user");

dotenv.config();

const seedFlags = async () => {
  try {
    console.log("Connecting to DB...");
    await connectDB();

    let products = await Product.find({});
    console.log(`Found ${products.length} products.`);

    if (products.length < 5) {
      console.log("⚠️ Not enough products. Creating dummy data...");
      
      // 1. Get or Create a Category
      let category = await Category.findOne();
      if (!category) {
        category = await Category.create({ 
          name: "General", 
          description: "General category" 
        });
      }

      // 2. Get or Create a Vendor (User)
      let vendor = await User.findOne({ role: "vendor" });
      if (!vendor) {
        // Try any user or create one
        vendor = await User.findOne() || await User.create({
          name: "Test Vendor",
          email: "vendor@test.com",
          password: "password123",
          role: "vendor",
          phone: "1234567890"
        });
      }

      // 3. Create Dummy Products
      const dummyProducts = [];
      for (let i = 1; i <= 10; i++) {
        dummyProducts.push({
          name: `Test Product ${i}`,
          description: `This is a description for test product ${i}`,
          price: 100 * i,
          categoryId: category._id,
          vendorId: vendor._id,
          stock: { quantity: 100, unit: "piece" },
          image: { url: "https://via.placeholder.com/300", public_id: "dummy" },
          tags: ["test", "dummy"]
        });
      }
      await Product.insertMany(dummyProducts);
      
      // Refresh the products list so we can flag the newly created ones
      products = await Product.find({});
      console.log("✅ Created 10 dummy products.");
    }

    // 1. Reset all flags
    await Product.updateMany({}, { isFeatured: false, isTopPick: false });
    console.log("Cleared existing flags.");

    // 2. Shuffle products to pick random ones
    const shuffled = products.sort(() => 0.5 - Math.random());

    // 3. Set Featured (First 5)
    const featured = shuffled.slice(0, 5);
    for (const p of featured) {
      p.isFeatured = true;
      await p.save();
    }
    console.log(`✅ Marked ${featured.length} products as 'Featured'.`);

    // 4. Set Top Picks (Next 4)
    const topPicks = shuffled.slice(5, 9);
    for (const p of topPicks) {
      p.isTopPick = true;
      await p.save();
    }
    console.log(`✅ Marked ${topPicks.length} products as 'Top Picks'.`);

    console.log("\nDone! Restart your Frontend to see the changes.");
    process.exit();
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

seedFlags();