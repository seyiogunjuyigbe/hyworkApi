const allSchema = require('../models/TenantModels');
const dbMigrations = (dbInstance, models = allSchema) => {
    Object.entries(models).forEach((model) =>{
        console.log(model[0]);
        if(!dbInstance.models[model[o]]) {
            dbInstance.model(model[0], model[1]);
        }
    });

    return true;
}

module.exports = dbMigrations;