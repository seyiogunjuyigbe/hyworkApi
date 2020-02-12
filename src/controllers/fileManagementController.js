import { File } from "../models/File";
import { crudControllers } from "../../utils/crud";

const response = require('../middlewares/response');

export default crudControllers(File);


module.exports = {
   async uploadFile (req, res) {
        const { title, description } = req.body;
        File.create({ title, description, fileLocationUrl: `uploads/files/${req.file.filename}`, uploadedBy: req.user._id }, (err, file) => {
            if (err) {
                response.error(res, 400, err);
            }
            response.success(res, 200, "File uploaded successfully")
        })

    },
 

    async fetchById (req, res) {
        File.findById(req.params.id, (err, file) => {
            if(err) {
                response.error(res, 404, err)
            }
            response.success(res, 200, file);
        })
    },

    async updateFileDetails (req, res) {
        const { title, description } = req.body; 
        const file = await File.findById(req.params.id);
        file.title = title;
        file.description = description;
        file.save((err) => {
            if(err) {
                response.error(res, 404, err)
            }
            response.success(res, 200, "File Updated")
        })
    }, 
    
    async fetchAllFiles (req, res) {
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

    async fetchFilesByUser (req, res) {
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
