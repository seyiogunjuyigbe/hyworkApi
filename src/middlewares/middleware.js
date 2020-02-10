import { Organization } from "../models/Organization";
import { response } from "../middlewares/response";

export const checkUrlExists = url => {
    Organization.find({ urlname: url }, (err, org) => {
        if (org) {
            console.log(org)
        }
        else {
            console.log(err)
        }
    })
}