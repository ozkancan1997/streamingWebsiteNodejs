const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const passport = require('passport')

const initialize = (passport, getUserByEmail)=>{
    console.log("init")
    const userAuthenticate = async (email, password, done)=>{
        const user = await getUserByEmail(email);
        if (user == null){
            return done(null, false, { message : "No User Found"})
        }

        try {
            if(await bcrypt.compare(password, user.password)){
                return done(null, user)
            }else{
                return done(null, false, { message : "Password incorrect"})
            }
        } catch (error) {
            return done(error)
        }
    }

    passport.use(new localStrategy({usernameField : 'email', passwordField: 'pass'},userAuthenticate))
    passport.serializeUser((user, done)=>{});
    passport.deserializeUser((id, done)=>{});
}

module.exports = initialize;