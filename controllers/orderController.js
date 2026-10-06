const mongoose = require('mongoose');
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Address = require('../models/Address')

const createOrder = async (req, res) => {
    try {
        const { addressId, paymentMethod = "cod" } = req.body;

        if (!mongoose.isValidObjectId(addressId)) {
            return res.status(400).json({
                message: "Invalid address ID",
            });
        }

        // get user cart
        const cart = await Cart.findOne({
            user: req.user._id,
        }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                message: "Cart is empty"
            })
        }

        // get user selected address
        const address = await Address.findOne({
            _id: addressId,
            user: req.user._id,
        })

        if (!address) {
            return res.status(400).json({
                message: "Address not found"
            })
        }

        // cart order items

        const items = cart.items.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            image: item.product.image,
            price: item.product.price,
            quantity: item.quantity,
            subtotal: item.product.price * item.quantity,

        }));


        // total
        const itemTotal = items.reduce((total, item) => total + item.subtotal, 0);
        const deliveryCharges = 30;

        const discount = itemTotal >= 200 ? 20 : 0;
        const totalAmount = itemTotal + deliveryCharges - discount;

        // create order
        const order = await Order.create({
            user: req.user._id,
            items,
            address: {
                name: address.name,
                mobile: address.mobile,
                addressLine: address.addressLine,
                city: address.city,
                state: address.state,
                pincode: address.pincode
            },
            paymentMethod,
            paymentStatus: "pending",
            itemTotal,
            deliveryCharges,
            discount,
            totalAmount,
            status: "placed",
        });

        // clear cart
        cart.items = [];
        await cart.save();

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });

    }

    catch (error) {
        res.status(500).json({
            message: "Failed to create order",
            error: error.message,
        })
    }
};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).populate("items.product")
            .sort({ createdAt: -1 });

        res.json(orders);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch orders"
        });
    }
};

const getOrderById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID",
            });
        }

        const order = await Order.findOne({
            _id: req.params.id,
            user: req.user._id,
        }).populate("items.product");

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch order",
            error: error.message,
        });
    }
}

const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name mobile email')
            .populate('items.product')
            .sort({ createdAt: -1 })

            res.json(orders)
    }catch(error){
        res.status(500).json({
            message:'Failed to fetch all orders',
            error:error.message,
        });
    }
};


const updateOrderStatus = async(req,res)=>{
    try{
        const{status} = req.body;

        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid order ID",
            });
        }

        const allowedStatuses = [
            "placed",
            'confirmed',
            'processing',
            'out_for_delivery',
            'delivered',
            'cancelled'
        ];

        if(!allowedStatuses.includes(status)){
            return res.status(400).json({
                message:"Invalid order Status",
            });
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            {status},
            {
                new:true,
                runValidators:true,
            }
        );

        if(!order){
            return res.status(404).json({
                message:"Order not found",
            });
        }

        res.json({
            message:"Order status updated successfully",
            order,
        });
    }
    catch(error){
        res.status(500).json({
            message:"Failed to update order status",
            error:error.message,
        })
    }

}

const getAdminDashboard = async(req,res)=>{
    try{
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({
            status:{
                $in:['placed','confirmed','processing'],
            },
        });

        const deliveredOrders = await Order.countDocuments({
            status:"delivered",
        });

        const cancelledOrders = await Order.countDocuments({
            status:'cancelled',
        });

        const revenueResult = await Order.aggregate([
            {
                $match:{
                    status:{
                        $ne:'cancelled',
                    },
                    paymentStatus:'paid',
                },
            },
            {
                $group:{
                    _id:null,
                    totalRevenue:{
                        $sum:'$totalAmount'
                    },
                }
            }
        ]);

        const totalRevenue = revenueResult.length>0?revenueResult[0].totalRevenue:0;

        res.json({
            totalOrders,
            pendingOrders,
            deliveredOrders,
            cancelledOrders,
            totalRevenue,
        });
    }
    catch(error){
        res.status(500).json({
            message:"failed to fetch dashboard data",
            error:error.message,
        });
    }
};



module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus,
    getAdminDashboard,
}