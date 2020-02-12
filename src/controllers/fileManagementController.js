import { File } from "../models/File";
const response = require('../middlewares/response');

module.exports = {
    uploadFile(req, res) {
        const { title, description } = req.body;
        File.create({ title, description, fileLocationUrl: `uploads/files/${req.file.filename}`, uploadedBy: req.user._id }, (err, file) => {
            if (err) {
                response.error(res, 500, err);
            }
            response.success(res, 200, "File uploaded successfully")
        })

    },

    async fetchAllFiles(req, res) {
        try {
            const files = await File.find({}).lean().exec()
            if (!files) {
                response.error(res, 400, "Could not fetch files");
            }
            response.success(res, 200, files)

        } catch (error) {
            response.error(res, 500, error.message)
        }

    }, 

    async fetchFilesByUser(req, res) {
        try {
            const files = await File.find({ uploadedBy: req.user._id }).lean().exec()
            if (!files) {
                response.error(res, 400, `No files owned by user ${req.user.username}`);
            }
            response.success(res, 200, files)

        } catch (error) {
            response.error(res, 500, error.message)
        }

    }

}