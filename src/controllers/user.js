const response = require('../middlewares/response');
import { User } from '../models/User';

export const addPhoneNumber = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            phoneNumber: phone
        });
        if (user) {
            response.success(res, 200, `User's Phone Number Updated`)
        }
    }catch(error) {
        response.error(res, 500, error.message)
    }
}

export const addPhoneNumber2 = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findByIdAndUpdate(req.user._id,{
            phoneNumber2: phone
        });
        if (user) {
            response.success(res, 200, `User's Phone Number Updated`)
        }
    }catch(error) {
        response.error(res, 500, error.message)
    }
}

export const addBioData = async (req, res) => {
    const { dob, maritalStatus, bioMessage } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user._id, { maritalStatus, dob, bioMessage });
        if(user) {
            response.success(res, 200, "Updated Bio Details")
        }
    }catch(error) {
        response.error(res, 500, error.message);
    }
}