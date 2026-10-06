const mongoose = require('mongoose')
require('dotenv').config();

const Product = require('./models/Products');
const products = require('./data/products');

const seedProducts = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);

        await Product.deleteMany();
        await Product.insertMany(products);

        console.log("Product added successfully");

        await mongoose.connection.close();

    }
    catch(error){
        console.error("Product seeding failed", error.message);
        process.exit(1);
    };
};

seedProducts();