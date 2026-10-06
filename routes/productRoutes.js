const express = require('express');
const protect = require('../middleware/authMiddleware')
const admin = require('../middleware/adminMiddleware')

const {
    getProducts,
    getProductById,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.get('/', getProducts);
router.get('/category/:category', getProductByCategory);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);


router.get('/:id', getProductById);

module.exports = router;