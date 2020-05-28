const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "uploads/files");
    },
    filename: (req, file, callback) => {
        callback(null, file.fieldname + '-' + Date.now());
    }
});

export const upload = multer({ storage: storage })