import { Router } from "express"
import socketServer from "../apps.js"
import messagesManager from "../dao/dbManagers/messages.js"

const manejadorMensajes = new messagesManager()

const router = Router()

router.post("/", async (req, res) => {
    const {user, message} = req.body

    try {
        const newMessage = await manejadorMensajes.saveMessages(user, message)
        socketServer.emit("newMessage", newMessage)
        res.status(200).send(({status: "success", payload: newMessage}))
        
    } catch {
        if(!user || !message) return res.status(400).send({status: "error", error: "Faltan datos"})
    }

})

export default router