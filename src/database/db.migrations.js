const allSchema = require('../models/TenantModels');
const dbMigrations = (dbInstance, models = allSchema) => {
    Object.entries(models).forEach(model =>{
        if(!dbInstance.models[model[0]]) {
            dbInstance.model(model[0], model[1]);
        }
    });

    return true;
}

module.exports = dbMigrations;