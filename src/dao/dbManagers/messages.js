import messagesModel from "../models/messages.js";

export default class Messages{
    constructor(){
        console.log("Estamos trabajando con bd mongo");
    }

    getAllMessages = () => {
        let messages = messagesModel.find().lean();
        if(!messages){
            messages = []
        }
        return messages
    }

    saveMessages = async (user, message) => {
        let result = await messagesModel.create({user, message})
        return result
    }
}