const response = require('../middlewares/response');
import { User } from '../models/TenantModels';

export const addPhoneNumber = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            if (!Boolean(user.phoneNumber)) {
                user.phoneNumber = phone;
                user.save();
                return response.success(res, 200, `User's Phone Number Added`)
                
            }
            return response.error(res, 404, `User Phone Number already exists`)
        }

    } catch (error) {
        response.error(res, 500, error.message)
    }
}


export const updateBioData = async (req, res) => {
    const { dob, maritalStatus, bioMessage } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, { maritalStatus, dob, bioMessage });
        if (user) {
            response.success(res, 200, "Added Bio Details")
        }
    } catch (error) {
        response.error(res, 500, error.message);
    }
}


