const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        profileIMage: {
            type: String,
            enum: ["mobile", "google", "apple"],
            default: "mobile",
        },
        role:{
            type:String,
            enum:['customer','admin'],
            default:'customer'
        }
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;