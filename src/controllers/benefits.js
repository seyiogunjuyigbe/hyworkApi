const response = require('../middlewares/response');

export const createBenefit = async (req, res) => {
    const { title, description, value } = req.body;
    const { Benefit } = req.dbModels;

    const benefit = await Benefit.create({ title, description, value });

    if (benefit) {
        return response.success(res, 201, `Successfully created ${benefit.title} ${benefit}`);
    }
    return response.error(res, 404, "Could not create benefit");

};

export const fetchBenefit = async (req, res) => {
    const { Benefit } = req.dbModels;
    Benefit.find({}, (err, benefits) => {
        if(err) { 
            return response.error(res, 500, err.message);
        }
        else if(!benefits) {
            return response.error(res, 404, 'Could not find benefits')
        } else {
            return response.success(res, 200, benefits);
        }

    })
}


export const fetchBenefitOfUser =  (req, res) => {
    const { User } = req.dbModels;
    User.findOne({username: req.body.username }).populate("benefits").exec((err, user) => {
        if(err) { 
            return response.error(res, 500, err.message);
        }
        else if(!user) {
            return response.error(res, 404, 'Could not find user')
        } else {
            return response.success(res, 200, user.benefits);
        }

    }
    )}

export const giveUserBenefit = async (req, res) => {
    const { Benefit, User } = req.dbModels;
    const { id, username } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        if (benefit) {
            User.findOne({ username }, (err, user) => {
                if (err) { response.error(res, 404, err) };
                console.log(user);
                user.benefits.push(benefit._id);
                benefit.beneficiaries.push(user._id);
                benefit.save();
                user.save();
                response.success(res, 200, `Gave employee ${user.firstName} ${user.lastName} the benefit ${benefit.title}`);

            });
        } else {
            return response.error(res, 404, 'Could not find the benefit specified');
        }
    } catch (error) {
        response.error(res, 500, error.message);
    }
}

export const removeBenefitFromUser = async (req, res) => {
    const { Benefit, User } = req.dbModels;
    const { id, username } = req.params;
    try {
        const benefit = await Benefit.findById(id);
        if (benefit) {
            User.findOne({ username }, (err, user) => {
                if (err) response.error(res, 404, 'Could not fetch user');
                if (user.benefits.includes(benefit._id)) {
                    user.benefits = user.benefits.filter(entry => { entry === benefit._id });
                    benefit.beneficiaries = benefit.beneficiaries.filter(entry => { entry === user._id });
                    benefit.save();
                    user.save();
                    response.success(res, 201, `Removed benefit ${benefit.title} from user ${user.firstName} ${user.lastName}`);
                }else {
                    return response.error(res, 404, `Employee ${user.firstName} ${user.lastName} does not have this benefit`);
                }
            });
        } else {
            return response.error(res, 404, 'Could not find the benefit specified');
        }
    } catch (error) {
        response.error(res, 500, error.message);
    }
}

export const getAllBenefits = (req, res) => {
    const { Benefit } = req.dbModels;
    Benefit.find({}, (err, benefits) => {
        if (err) { response.error(res, 404, 'Could not fetch benefits') };
        response.success(res, 200, benefits);
    });
}