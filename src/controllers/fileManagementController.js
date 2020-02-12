import { File } from "../models/File";
const response = require('../middlewares/response');

module.exports = {
    async uploadFile(req, res) {
        const { title, description } = req.body;
        File.create({ title, description, fileLocationUrl: `uploads/files/${req.file.filename}`, uploadedBy: req.user._id }, (err, file) => {
            if (err) {
                response.error(res, 500, err);
            }
            response.success(res, 200, "File uploaded successfully")
        })

    }
}