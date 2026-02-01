const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeFromCart, getCartSummary } = require('../controllers/cartController');

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
router.get("/summary", protect, getCartSummary);

module.exports = router;
