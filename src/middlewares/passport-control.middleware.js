import passport from "./passport.middleware.js"

const passportControl = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, {session:false}, (error, user, info) => {
            if(error) next(error)
            if(!user) return res.status(401).json({error: info.message ?? `${info}`})

            req.user = user
            next()
        })(req, res, next)
    }
}

export default passportControl