import { Organization } from "../models/Organization";
import { response } from "../middlewares/response";

export const checkUrlExists = url => {
    Organization.find({ urlname: url }, (err, org) => {
        if (org && !org[0].name === undefined) {
            return true
        }
        else {
            return false
        }
    })
}