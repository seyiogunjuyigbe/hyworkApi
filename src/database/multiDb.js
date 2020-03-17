const mongoose = require('mongoose');
const dbMigration = require('./db.migrations');

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useNewUrlParser', true);

const mongooseConfig = {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true

}
const DATABASE_URL = 'mongodb://localhost:27017'
let _pool = {};

const connect = async () => mongoose.createConnection(
    `${DATABASE_URL}`, mongooseConfig, (err, client) => {
        if (err) {
            console.error('DATABASE connection failed');
            process.exit(1);
            return false
        }
        console.log('DATABASE connected successfully!');
        _pool = { default: client };
        return true;
    },
);


const getDBInstance = (dbName) => {
    if (_pool[dbName]) return _pool[dbName];
    const newConnection = _pool.default.useDb(dbName);
    const isModelCompiled = dbMigration(newConnection);
    _pool[dbName] = newConnection;

    if (!isModelCompiled) getDbInstance(dbName);
    _pool[dbName] = newConnection;
    return newConnection;
};

module.exports = { connect, getDBInstance };
