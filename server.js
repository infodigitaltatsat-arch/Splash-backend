require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });

const express = require('express')
const cors = require('cors')
const app = express();
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes')
const addressRoutes = require('./routes/addressRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes')

app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/addresses',addressRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/orders',orderRoutes)

app.get('/',(req,res)=>{
    res.json({
        message:"Dairy products api is running"
    })
});

connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});
