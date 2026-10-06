const express = require('express');

const protect = require('../middleware/authMiddleware');

const{
    getCart,
      addToCart,
      updateCartItem,
      removeFromCart,
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);
router.get('/',getCart);
router.post('/',addToCart);
router.put('/:productId',updateCartItem);
router.delete('/:productId',removeFromCart);


module.exports = router;