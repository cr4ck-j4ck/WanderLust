const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

module.exports.storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "WanderLust_DEV"
    },
});


