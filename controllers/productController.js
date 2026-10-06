const mongoose = require('mongoose');
const Product = require('../models/Products');

const getProducts = async (req, res) => {
    try {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            bestSeller,
            sort,
        } = req.query;

        const filter = {};

        // search
        if(search){
            filter.name = {$regex:search,$options:'i'}
        };

        // category
        if(category){
            filter.category = category;
        }

        // price range
        if(minPrice || maxPrice){
            filter.price = {};

            if(minPrice){
                filter.price.$gte=Number(minPrice);
            }
            if(maxPrice){
                filter.price.$lte=Number(maxPrice);
            }
        }

        if(bestSeller === "true"){
            filter.isBestSeller = true;
        }

        // sorting
        let sortOption = {};

        if(sort === 'price_asc'){
            sortOption.price = 1;
        }
        if(sort === 'price_desc'){
            sortOption.price = -1;
        }

        const products = await Product.find(filter).sort(sortOption);
        res.json(products);
    }catch(error){
        res.status(500).json({
            message:"Failed to fetch",
            error:error.message,
        });
    }
};


const getProductById = async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found",
            });
        }

        res.json(product);
    }
    catch (error) {
        res.status(500).json({
            message: 'Failed to fetch the product',
            error: error.message,
        });
    }
}


const getProductByCategory = async (req, res) => {
    try {
        const products = await Product.find({
            category: req.params.category,
        });

        res.json(products);
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch category products",
            error: error.message,
        });
    }
}

const createProduct = async(req,res)=>{
    try{
        const product = await Product.create(req.body);
        res.status(201).json({
            message:"Product created successfully",
            product,
        });
    }
    catch(error){
        res.status(400).json({
            message:"Failed to create products",
            error:error.message,
        });
    }
};

const updateProduct = async(req,res)=>{
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new:true,
                runValidators:true,
            }
        );

        if(!product){
            return res.status(404).json({
                message:"Product not found"
            });
        }

        res.json({
            message:"Product updated successfully",
            product,
        });
    }
    catch(error){
        res.status(400).json({
            message:'Failed to update products',
            error:error.message,
        })
    }
};

const deleteProduct = async(req,res)=>{
    try{
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(400).json({
                message: "Invalid product ID",
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if(!product){
            return res.status(404).json({
                message:"Product not Found",

            })
        }
        res.json({
            message:"Product deleted successfully",
           
        })
    }
    catch(error){
        res.status(500).json({
            message:"Failed to delete product",
            error:error.message,
        })
    }
}

module.exports = {
    getProducts,
    getProductById,
    getProductByCategory,
    createProduct,
    updateProduct,
    deleteProduct,
}