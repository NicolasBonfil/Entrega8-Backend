import passport from "passport"
import passportJwt from "passport-jwt"
import {cookieExtractor} from "../utils.js"

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const SECRET_KEY = "c0d3rs3cr3t"

passport.use(new JwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: SECRET_KEY
    },
    async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch (error) {
            return done(error)
        }
    }
))
export default passport