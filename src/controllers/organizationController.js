import { Organization } from '../models/Organization';

module.exports = {
    async createOrganization (req, res) {
        try {
           const { name, description, category } = req.body;
           const newOrganization = await Organization.create({...req.body, admin:req.user.id }).lean().exec();

        }
    }
}
