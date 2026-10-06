const express = require('express')
const protect = require('../middleware/authMiddleware');
const admin = require('../middleware/adminMiddleware')

const{
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getAdminDashboard
} = require('../controllers/orderController')

const router = express.Router();

router.use(protect);
router.post('/',createOrder);
router.get('/',getMyOrders);
router.get('/admin/dashboard',admin,getAdminDashboard);
router.get('/:id',getOrderById);

router.get('/admin/all',admin,getAllOrders);
router.put('/admin/:id/status',admin,updateOrderStatus);


module.exports = router;