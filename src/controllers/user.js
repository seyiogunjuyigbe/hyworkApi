const response = require('../middlewares/response');
import { User } from '../models/User';

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
            if(!Boolean(user.phoneNumber2)) {
                user.phoneNumber2 = phone;
                user.save();
                return response.success(res, 200, `User's Second Phone Number Added`)
            
            }
            return response.error(res, 404, `User Phone Number already exists`)
        }

    } catch (error) {
        response.error(res, 500, error.message)
    }
}


export const addBioData = async (req, res) => {
    const { dob, maritalStatus, bioMessage } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, { maritalStatus, dob, bioMessage });
        if (user) {
            response.success(res, 200, "Updated Bio Details")
        }
    } catch (error) {
        response.error(res, 500, error.message);
    }
}

