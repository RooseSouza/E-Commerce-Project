const mongoose = require("mongoose"); 
const Product = require("../models/product"); 
const Category = require("../models/category"); 
const cloudinary = require("../config/cloudinary"); 

// Vendor adds product 
exports.addProduct = async (req, res) => { 
  try { 
    const { 
      name, 
      description, 
      price, 
      categoryName, 
      stockQuantity, 
      stockUnit, 
      tags, 
      isTopPick, 
      isFeatured, 
    } = req.body; 

    if (!req.file) { 
      return res.status(400).json({ message: "Product image is required" }); 
    } 

    if ( 
      !name || 
      !description || 
      !price || 
      !categoryName || 
      stockQuantity === undefined || 
      !stockUnit 
    ) { 
      return res 
        .status(400) 
        .json({ message: "Please provide all required fields" }); 
    } 

    const category = await Category.findOne({ name: categoryName }); 
    if (!category) { 
      return res.status(400).json({ message: "Invalid category selected" }); 
    } 

    let processedTags = []; 
    if (tags) { 
      processedTags = Array.isArray(tags) 
        ? tags.map((tag) => tag.toLowerCase()) 
        : tags.split(",").map((tag) => tag.trim().toLowerCase()); 
    } 

    const product = await Product.create({ 
      name, 
      description, 
      price, 
      categoryId: category._id, 
      image: { 
        url: req.file.path, // Cloudinary secure_url 
        public_id: req.file.filename // Cloudinary public_id 
      }, 
      vendorId: req.user._id, 
      stock: { 
        quantity: stockQuantity, 
        unit: stockUnit, 
      }, 
      tags: processedTags, 
      isTopPick: isTopPick === 'true' || isTopPick === true, 
      isFeatured: isFeatured === 'true' || isFeatured === true, 
    }); 

    const populatedProduct = await Product.findById(product._id) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 

    res.status(201).json({ 
      message: "Product added successfully", 
      product, 
    }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Vendor gets own products 
exports.getMyProducts = async (req, res) => { 
  try { 
    const products = await Product.find({ vendorId: req.user._id }).populate( 
      "categoryId", 
      "name", 
    ); 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Users get all active products 
exports.getAllProducts = async (req, res) => { 
  try { 
    const filter = req.user.role === "admin" ? {} : { isActive: true }; 

    const initialProducts = await Product.find(filter) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 

    const { 
      isTopPick, 
      isFeatured, 
      isJustArrived, 
      limit, 
      categoryId, 
      category 
    } = req.query; 

    // Helper to robustly check for true values (handles "true", "True", true) 
    const isTrue = (val) => { 
      if (typeof val === 'string') return val.trim().toLowerCase() === 'true'; 
      return val === true; 
    }; 

    if (isTrue(isTopPick)) { 
      filter.isTopPick = { $in: [true, 'true'] }; 
    } 

    if (isTrue(isFeatured)) { 
      filter.isFeatured = { $in: [true, 'true'] }; 
    } 

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) { 
      filter.categoryId = categoryId; 
    } else if (category) { 
      // Fallback: Find category by name if ID is missing 
      const categoryDoc = await Category.findOne({ 
        name: { $regex: new RegExp(`^${category}$`, 'i') } 
      }); 

      if (categoryDoc) { 
        filter.categoryId = categoryDoc._id; 
      } else { 
        return res.json([]); // Category not found, return empty list 
      } 
    } 

    let query = Product.find(filter) 

    if (isTrue(isJustArrived)) { 
      query = query.sort({ createdAt: -1 }); 
    } 

    if (limit) { 
      query = query.limit(Number(limit)); 
    } 

    query = query.populate("categoryId", "name").populate("vendorId", "name"); 

    const products = await query; 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

//User searches for product 
exports.searchProducts = async (req, res) => { 
  try { 
    const { q } = req.query; 
    if (!q) { 
      return res.status(400).json({ message: "Search query is required" }); 
    } 

    const products = await Product.find({ 
      $or: [ 
        { name: { $regex: q, $options: "i" } }, 
        { tags: { $regex: q, $options: "i" } } 
      ] 
    }) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 

    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Vendor gets single product (Protected: checks ownership) 
exports.getProductById = async (req, res) => { 
  try { 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { 
      return res.status(404).json({ message: "Product not found (Invalid ID)" }); 
    } 

    const product = await Product.findOne({ 
      _id: req.params.id, 
      vendorId: req.user._id, 
    }).populate("categoryId", "name"); 

    if (!product) { 
      return res.status(404).json({ 
        message: "Product not found or access denied", 
      }); 
    } 

    res.json(product); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Public gets single product (No auth required) 
exports.getPublicProduct = async (req, res) => { 
  try { 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { 
      return res.status(404).json({ message: "Product not found (Invalid ID)" }); 
    } 

    const product = await Product.findById(req.params.id) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 

    if (!product) { 
      return res.status(404).json({ message: "Product not found" }); 
    } 

    res.json(product); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

/** 
 * Vendor updates SINGLE product 
 */ 
exports.updateProduct = async (req, res) => { 
  try { 
    // 🔍 Debug (keep for now) 
    console.log("REQ BODY:", req.body); 
    console.log("REQ FILES:", req.files); 

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { 
      return res.status(404).json({ message: "Product not found (Invalid ID)" }); 
    } 

    const updateData = {}; 

    // -------- BASIC FIELDS -------- 
    if (req.body.name !== undefined) { 
      updateData.name = req.body.name; 
    } 

    if (req.body.description !== undefined) { 
      updateData.description = req.body.description; 
    } 

    if (req.body.price !== undefined) { 
      const price = Number(req.body.price); 
      if (!isNaN(price)) updateData.price = price; 
    } 

    /* ---------- CATEGORY ---------- */ 
    if (req.body?.categoryName) { 
      const category = await Category.findOne({ name: req.body.categoryName }); 
      if (!category) { 
        return res.status(400).json({ message: "Invalid category selected" }); 
      } 
      updateData.categoryId = category._id; 
    } 

    // -------- STOCK -------- 
    if (req.body.stockQuantity !== undefined && req.body.stockQuantity !== "") { 
      const qty = Number(req.body.stockQuantity); 
      if (!isNaN(qty)) { 
        updateData["stock.quantity"] = qty; 
        updateData.isActive = qty > 0; // auto enable/disable 
      } 
    } 

    if (req.body.stockUnit) { 
      updateData["stock.unit"] = req.body.stockUnit; 
    } 

    // -------- CATEGORY -------- 
    if ( 
      req.body.categoryId && 
      mongoose.Types.ObjectId.isValid(req.body.categoryId) 
    ) { 
      updateData.categoryId = req.body.categoryId; 
    } 

    // -------- IMAGE -------- 
    if (req.file) { 
      const file = req.file; 

      // remove old image 
      const oldProduct = await Product.findById(req.params.id); 
      if (oldProduct?.image?.public_id) { 
        await cloudinary.uploader.destroy(oldProduct.image.public_id); 
      } 

      updateData.image = { 
        url: file.path, 
        public_id: file.filename, 
      }; 
    } 

    // -------- UPDATE -------- 
    const updatedProduct = await Product.findOneAndUpdate( 
      { _id: req.params.id, vendorId: req.user._id }, 
      { $set: updateData }, 
      { 
        new: true, 
        runValidators: true, 
      } 
    ) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 

    if (!updatedProduct) { 
      return res.status(404).json({ 
        message: "Product not found or not authorized", 
      }); 
    } 

    res.status(200).json({ 
      message: "Product updated successfully", 
      product: updatedProduct, 
    }); 
  } catch (error) { 
    console.error("UPDATE PRODUCT ERROR:", error); 
    res.status(500).json({ 
      message: "Server error while updating product", 
      error: error.message, 
    }); 
  } 
}; 

// maunal disable or enable product 
exports.toggleProductStatus = async (req, res) => { 
  try { 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { 
      return res.status(404).json({ message: "Product not found (Invalid ID)" }); 
    } 

    const product = await Product.findOne({ 
      _id: req.params.id, 
      vendorId: req.user._id 
    }); 

    if (!product) { 
      return res.status(404).json({ message: "Product not found" }); 
    } 

    // 🔹 AUTO DISABLE IF STOCK = 0 
    if (product.stock?.quantity === 0) { 
      product.isActive = false; 
    } else { 
      // 🔹 MANUAL TOGGLE 
      product.isActive = !product.isActive; 
    } 

    await product.save(); 

    res.json({ 
      message: `Product ${product.isActive ? "activated" : "disabled"} successfully`, 
      isActive: product.isActive 
    }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Get Top Picks 
exports.getTopPicks = async (req, res) => { 
  try { 
    const products = await Product.find({ isTopPick: true }) 
      .limit(4) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Get Featured Products 
exports.getFeaturedProducts = async (req, res) => { 
  try { 
    const products = await Product.find({ isFeatured: true }) 
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Get Just Arrived Products 
exports.getJustArrivedProducts = async (req, res) => { 
  try { 
    const products = await Product.find() 
      .sort({ createdAt: -1 }) 
      .limit(5) 
      .populate("categoryId", "name") 
      .populate("vendorId", "name"); 
    res.json(products); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
}; 

// Vendor deletes product 
exports.deleteProduct = async (req, res) => { 
  try { 
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { 
      return res.status(404).json({ message: "Product not found (Invalid ID)" }); 
    } 

    const deletedProduct = await Product.findOneAndDelete({ 
      _id: req.params.id, 
      vendorId: req.user._id, 
    }); 

    if (!deletedProduct) { 
      return res.status(403).json({ 
        message: "You can delete only your own product", 
      }); 
    } 

    res.json({ message: "Product deleted successfully" }); 
  } catch (error) { 
    res.status(500).json({ error: error.message }); 
  } 
};
