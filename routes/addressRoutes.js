const express = require('express');

const protect = require('../middleware/authMiddleware');

const {
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
} = require('../controllers/addressController');

const router = express.Router();

router.use(protect);
router.get('/', getAddresses);
router.post('/', addAddress)
router.put('/:id', updateAddress)
router.delete('/:id', deleteAddress);

module.exports = router;