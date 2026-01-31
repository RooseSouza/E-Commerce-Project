const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getCart, addToCart, updateCartItem, removeFromCart, getCartSummary } = require('../controllers/cartController');

router.use(protect); // All cart routes require login

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeFromCart);
<<<<<<< HEAD
router.get('/summary', getCartSummary);
=======
router.get("/summary", protect, getCartSummary);
>>>>>>> c0fac868fce54d35e071540e136191587e8435a5

module.exports = router;
