import { Router } from "express"
import userModel from "../dao/models/Users.model.js"
import passport from "passport"
import {createHash} from "../utils.js"
import jwt from "jsonwebtoken"
import auth from "../middlewares/auth.middlewares.js"

const router = Router()

router.post("/register", passport.authenticate("register", {passReqToCallback: true, session: false, failureRedirect: "/api/session/failedRegister", failureMessage: true}), (req, res) => {
    res.status(200).send({status: "success", message: "Usuario registrado", payload: req.user._id})
})

router.post("/login", passport.authenticate("login", {passReqToCallback: true, session: false, failureRedirect: "/api/session/failedLogin", failureMessage: true}), (req, res) => {
    const serialUser = {
        id: req.user.id,
        name: `${req.user.first_name}`,
        role: req.user.role,
        email: req.user.email
    }

    const token = jwt.sign(serialUser, "coderUser", {expiresIn: "1h"})
    res.cookie("coderCookie", token, {maxAge: 36000000})
    res.status(200).send({status:"success", payload: serialUser})
})

router.get("/failedRegister", (req, res) => {
    console.log("error");
    res.status(400).send({message: "Failed register"})
})

router.get("/failedLogin", (req, res) => {
    console.log("error");
    res.status(400).send({message: "Failed login"})
})

router.post("/resetPassword", async (req, res) => {
    const {email, password} = req.body
    if(!email || !password) return res.status(400).send({status: "error", error: "Error user"})
    const user = await userModel.findOne({email})
    if(!user) return res.status(400).send({status: "error", error: "Error userr"})

    user.password = createHash(password)

    const result = await userModel.updateOne({email:email}, user)
    res.status(200).send({payload: result})
})


router.get("/github", passport.authenticate("github", {scope: ["user: email"]})),async (req, res) => {
    res.status(200).send("Usuario logueado con GitHub")
}

router.get("/githubCallback", passport.authenticate("github", {failureRedirect: "/login"})),async (req, res) => {
    req.session.user = req.user
    res.redirect("/products")
}


router.post("/logout", (req, res) => {
    req.session.destroy(error => {
        if(error){
            res.status(400).json({error: "error logout", mensaje: "Error al cerrar la sesion"})
        }
        res.status(200).send("Sesion cerrada correctamente")
    })
})

router.get("/current", auth, (req, res) => {
    console.log(req.user);
})
export default router