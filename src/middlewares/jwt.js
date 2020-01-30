const jwtStrategy = require('passport-jwt').Strategy,
    extractJwt = require('passport-jwt').ExtractJwt;
    import {SECRET_KEY} from '../config/constants'
    import {User} from '../models/User'
const opts = {
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: SECRET_KEY
};

module.exports = passport =>{
    passport.use(
        new jwtStrategy(opts, (jwt_payload, done)=>{
            User.findById(jwt_payload.id)
            .then(user =>{
                if(user) return done(null,user);
                return done(null,false);
            })
            .catch(err =>{
                return done(err, false, {message: 'Server Error'})
            });
        })
    )
}