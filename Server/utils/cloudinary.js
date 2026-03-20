import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// 1. This MUST be called before cloudinary.config
dotenv.config(); 

// 2. Add these logs to see if the keys are actually loading
console.log("Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API Key loaded:", !!process.env.CLOUDINARY_API_KEY);

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;