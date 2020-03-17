const response = require('../middlewares/response');


export const addPhoneNumber = async (req, res) => {
    const { phone } = req.body;
    const { User } = req.dbModels;
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
    const { User } = req.dbModels;
    try {
        const user = await User.findByIdAndUpdate(req.user._id, { maritalStatus, dob, bioMessage });
        if (user) {
            response.success(res, 200, "Added Bio Details")
        }
    } catch (error) {
        response.error(res, 500, error.message);
    }
}

export const addPassword = (req, res) => {
    const { User } = req.dbModels;
    const { password, confirmPassword } = req.body;
    const { username } = req.params;
    if (password !== confirmPassword) {
        response.error(res, 404, 'Password and Confirm Password must be the same');
    }
    if (password.length < 8) {
        response.error(res, 404, 'Password needs to be eight characters long');    
    }
    User.findOne({ username }, (err, user) => {
        if(err) {
            response.error(res, 404, err);
        }
        user.changePassword(user.password, password, (err, user)=>{
            if(err) {
                response.error(res, 404, err);
            }
            user.save();
        })
    })
}

const addDependentToUser = (req, res) => {
    const { User, Dependent } = req.dbModels;
    const { firstName, lastName, relationship, phoneNumber, email } = req.body;
    const { username } = req.params;

    User.findOne({username}, (err, user) => {
        if(err) {
            response.error(res, 501, err);
        }
        Dependent.create({ firstName, lastName, relationship, phoneNumber, email}, (err, dependent) => {
            if(err) {
                response.error(res, 501, err);
            }
            user.dependents.push(dependent._id);
            user.save();
            response.success(res, 201, "Dependent added");
        })
    })

}

const removeDependentFromUser = (req, res) => {
    const { User, Dependent } = req.dbModels;
    const { username, id } = req.params;
    Dependent.findById({id}, (err, dependent) => {
        if(err) {
            response.error(res, 500, err);
        }
        User.findOne({username}, (err, user) => {
            if(err) {
                response.error(res, 500, err);
            }
            if(user.dependents.includes(dependent._id)) {
                user.dependents = user.dependents.filter(entry => { entry === dependent._id});
                user.save();
                response.success(res, 201, `Dependent ${dependent.firstName} removed`);
            }
        })

    })
    
}


const updateBioMessage = (req, res) => {
    const { User } = req.dbModels;
    const { username } = req.params;
    const { bioMessage } = req.body;

    User.findOne({username}, (err, user) => {
        if(err) {
            response.error(res, 404, err);
        }
        user.bioMessage = bioMessage;
        user.save();
        response.success(res, 201, "Successfully added user bioMessage");
    });
}

const addAddress = (req, res) => {
    const { User } = req.dbModels;
    const { username } = req.params;
    const { address } = req.body;

    User.findOne({username}, (err, user) => {
        if(err) {
            response.error(res, 404, err);
        }
        user.address = address;
        user.save();
        response.success(res, 201, "Successfully added user's address");
    });

}

