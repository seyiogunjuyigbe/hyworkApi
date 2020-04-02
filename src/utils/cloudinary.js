import { CLOUDINARY_FOLDER, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } from "../config/constants";
const cloudinary = require('cloudinary');
const multer = require('multer');
const cloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET
});

const parser = multer({
    storage: cloudinaryStorage({
        cloudinary,
        folder: CLOUDINARY_FOLDER,
        filename: (req, file, cb) => {
            cb(undefined, file.originalname);
        }
    })
});


module.exports = parser;