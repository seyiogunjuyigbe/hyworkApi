import { Benefit } from '../models/Benefit';
import { User } from '../models/User';

const response = require('../middlewares/response');

export const createBenefit = async (req, res) => {
    const { title, description, value } = req.body;

    const benefit = await Benefit.create({ title, description, value });

    if (benefit) {
        response.success(res, 201, `Successfully created ${benefit.title} \n data:${benefit}`);
    }
    response.error(res, 404, "Could not create benefit");

};

export const giveUserBenefit = async (req, res) => {
    const { id, username } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        if (benefit) {
            User.findOne({ username }, (err, user) => {
                if (err) { response.error(res, 404, err) };
                user.benefits.push(benefit._id)
                user.save().then(() => response.success(res, 200, `Gave employee ${user.firstName} ${user.lastName} the benefit ${benefit.title}`));
            });
        }
        response.error(res, 404, 'Could not find the benefit specified');
    } catch (error) {
        response.error(res, 500, error.message);
    }
}

export const removeBenefitFromUser = async(req, res) => { 
    const { id, username } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        if(benefit) {
            User.findOne({ username }, (err,user) => {
                if(err) response.error(res, 404, 'Could not fetch user');
                if(user.benefits.includes(benefit._id)) {
                    user.benefits = user.benefits.filter(entry => { entry === benefit._id });
                    user.save().then(
                        response.success(res, 201, `Removed benefit ${benefit.title} from user ${user.firstName} ${user.lastName}`)
                    )
                }
            })
        }
    }catch (error) {
        response.error(res, 500, error.message);
    }
}

export const getAllBenefits = (req, res) => {
    Benefit.find({}, (err, benefits) => {
        if(err) { response.error(res, 404, 'Could not fetch benefits') };
        response.success(res, 200, benefits);
    });
}