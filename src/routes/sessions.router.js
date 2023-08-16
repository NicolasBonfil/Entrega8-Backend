import { Router } from "express"
import userModel from "../dao/models/Users.model.js"
import passport from "passport"
import {createHash} from "../utils.js"

const router = Router()

// router.post("/register", async (req, res) => {
//     const {first_name, last_name, email, password} = req.body

//     if(!first_name || !last_name || !email || !password) return res.status(400).send({status: "error", error: "Debes completar todos los campos"})

//     const exist = await userModel.findOne({email})

//     if(exist || email === "adminCoder@coder.com") return res.status(400).send({status: "error", error: "Usuario existente"})

//     try {
//         const user = {
//             first_name,
//             last_name,
//             email,
//             password: createHash(password)
//         }

//         let result = await userModel.create(user)
//         const access_token = generateToken(user);
//         res.status(200).send({status: "success", message: "Usuario registrado", access_token}) 
//     } catch (error) {
//         res.status(400).send({status: "error", error: "Error al registrar el usuario"})
//     }
// })

// router.post("/login", async (req, res) => {
//     const {email, password} = req.body

//     if(!email || !password) return res.status(400).send({status: "error", error: "Debes completar todos los campos"})

//     let user = await userModel.findOne({email})
//     if(!user && (email !== "adminCoder@coder.com" && password !== "adminCod3r123")) return res.status(400).send({status: "error", error: "Invalid email"})

//     if(!isValidPassword(user, password)) return res.status(403).send({status: "error", error: "Error Credentials"})

//     let rol = "User"
    
//     if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
//         rol = "Admin"
//         user = {
//             first_name: "Admin",
//             last_name: "Coder",
//             email: email
//         }
//     }

//     req.session.user = {
//         name: `${user.first_name} ${user.last_name}`,
//         email: user.email,
//         rol: rol
//     }

//     req.session.log = true
//     const access_token = generateToken(user)
//     res.status(200).send({status: "success", payload: req.session.user, message: "Usuario logueado", access_token})
// })

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
    res.cookie("coderCookie", token, {maxAge: 36000000}).send({status:success, payload: serialUser})
})

router.get("/failedRegister", (req, res) => {
    console.log("error");
})

router.get("/failedLogin", (req, res) => {
    console.log(req.message);
    res.send("Failed login")
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
export default router