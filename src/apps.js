import express from "express"
import session from "express-session"
import MongoStore from "connect-mongo"
import mongoose from "mongoose"
import handlebars from "express-handlebars"
import { Server } from "socket.io"

import __dirname from "./utils.js"

import viewRouter from "./routes/views.router.js"
import sessionRouter from "./routes/sessions.router.js"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"
import messagesRouter from "./routes/messages.router.js"

import initializePassport from "./config/passport.config.js"
import passport from "passport"
import cookieParser from "cookie-parser"



const app = express()

mongoose.set("strictQuery", false)

const connection = mongoose.connect("mongodb+srv://bonfilnico:12345@pruebacoder.q69nl8a.mongodb.net/?retryWrites=true&w=majority",{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "ecommerce"
})

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

app.use(session({
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://bonfilnico:12345@pruebacoder.q69nl8a.mongodb.net/?retryWrites=true&w=majority",
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl:3600
    }),
    secret: "12345abcd",
    resave: false,
    saveUninitialized:false
}))

app.engine("handlebars", handlebars.engine())
app.set("views", __dirname + "/views")
app.set("view engine", "handlebars")

app.use(cookieParser())
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/messages", messagesRouter)
app.use("/", viewRouter)
app.use("/api/session", sessionRouter)

app.use(passport.initialize())
initializePassport()
app.use(session({
    secret: "SecretCoders"
}))


const httpserver = app.listen(8080, () => console.log("Server arriba"))
const socketServer = new Server(httpserver)

socketServer.on("connection", socket => {
    console.log("Nuevo cliente");
})

export default socketServer

