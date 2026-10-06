const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req,res,next)=>{
    try{
        const authHeader = req.get('Authorization');

        if(!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({
                message:"Not authorized"
            });

        }

        const token = authHeader.split(" ")[1];

        const decode = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decode.userId).select(
            "-password"
        );

        if(!user){
            return res.status(401).json({
                message:"User not found",
            });
        }
        req.user = user;
        next();
    }
    catch(error){
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

module.exports = protect