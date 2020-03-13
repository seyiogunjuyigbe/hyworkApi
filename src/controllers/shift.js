import { User } from '../models/User';
import { Organization } from '../models/Organization'
import { Shift } from '../models/TenantModels'
import { calcTimeDiffWithoutSec } from '../middlewares/attendanceCalc'


// create a workshift schedule
// @POST /:urlname/shifts/new
// Access: Admin
export const createShift = (req, res) => {
    // Fetch Organization
    const { TenantOrganization, Shift } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }, (err, org) => {
        if (!req.user) {
            return res.status(401).json({ message: 'You need to be logged in' })
        }
        else if (err) {
            return res.status(500).json({ message: err.message })
        } else if (!org) {
            return res.status(404).json({ message: 'No organization with this name was found... please check again' })
        }
        else if (!org.admin.includes((req.user._id))) {
            return res.status(401).json({ message: 'You are unauthorized to create a shift' })
        } else {
            var timeDiff = calcTimeDiffWithoutSec(req.body.startTime, req.body.endTime);
            if (timeDiff <= 0) {
                return res.status(422).json({ success: false, message: 'Shift end time can not be earlier than start time' })
            } else {
                Shift.create({ ...req.body }, (err, shift) => {
                    if (err) {
                        return res.status(500).json({ message: err.message })
                    } else {
                        shift.createdBy = req.user._id;
                        shift.createdFor = org;
                        shift.save();
                        org.shifts.push(shift);
                        org.save()
                        return res.status(200).json({ message: 'Shift created successfully and saved to organization' })
                    }
                })
            }
        }
    })

}





// Update shift
export const updateShift = (req, res) => {
    console.log(req.params);
    const { TenantOrganization, Shift } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }, (err, org) => {
        if (!req.user) {
            return res.status(401).json({ message: 'You need to be logged in' })
        }
        else if (err) {
            return res.status(500).json({ message: err.message })
        } else if (!org) {
            return res.status(404).json({ message: 'No organization with this name was found... please check again' })
        }
        else if (!org.admin.includes((req.user._id))) {
            return res.status(401).json({ message: 'You are unauthorized to edit a shift' })
        } else {
            var timeDiff = calcTimeDiffWithoutSec(req.body.startTime, req.body.endTime);
            if (timeDiff <= 0) {
                return res.status(422).json({ success: false, message: 'Shift end time can not be earlier than start time' })
            } else {
                Shift.findByIdAndUpdate(req.params.shift_id, { ...req.body }, (err, shift) => {
                    if (err) {
                        return res.status(500).json({ message: err.message })
                    } else if (String(shift.createdBy) !== String(req.user._id)) {
                        return res.status(401).json({ message: 'You cannot edit this shift' })
                    } else {
                        shift.createdFor = org;
                        shift.save();
                        return res.status(200).json({ message: 'Shift updated successfully and saved to organization' })
                    }
                })
            }
        }
    })
}



export const fetchShifts = (req, res) => {
    const { TenantOrganization, Shift } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }, (err, org) => {
        if (!req.user) {
            return res.status(401).json({ message: 'You need to be logged in' })
        }
        else if (err) {
            return res.status(500).json({ message: err.message })
        } else if (!org) {
            return res.status(404).json({ params: req.params, message: 'No organization with this name was found... please check again' })
        }
        else if (!org.admin.includes((req.user._id))) {
            return res.status(401).json({ message: 'You are unauthorized to fetch shifts' })
        }
        else {
            Shift.find({ createdFor: org._id }, (err, shifts) => {
                if (err) return res.status(500).json({ message: err.message })
                else if (!shifts) return res.status(404).json({ message: 'No shifts found for this organzation' })
                else return res.status(200).json({ shifts })
            })

        }
    })
}


export const deleteShift = (req, res) => {
    console.log(req.params)
    const { TenantOrganization, Shift } = req.dbModels;
    TenantOrganization.findOne({ urlname: req.params.urlname }, (err, org) => {
        if (!req.user) {
            return res.status(401).json({ message: 'You need to be logged in' })
        }
        else if (err) {
            return res.status(500).json({ message: err.message })
        } else if (!org) {
            return res.status(404).json({ message: 'No organization with this name was found... please check again' })
        }
        else if (!org.admin.includes((req.user._id))) {
            return res.status(401).json({ message: 'You are unauthorized to delete a shift' })
        } else {
            Shift.findByIdAndDelete(req.params.shift_id, (err, shift) => {
                if (err) {
                    return res.status(500).json({ message: err.message })
                } else if (String(shift.createdBy) !== String(req.user._id)) {
                    return res.status(401).json({ message: 'You cannot delete this shift' })
                } else {
                    return res.status(200).json({ message: 'Shift deleted successfully' })
                }
            })
        }
    })
}