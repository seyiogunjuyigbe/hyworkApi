const mongoose = require('mongoose');
const mongooseConfig = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
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
    _pool[dbName] = newConnection;
    return newConnection;
};

module.exports = { connect, getDBInstance };
