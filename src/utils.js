import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt, { genSaltSync } from "bcrypt"
import jwt from "jsonwebtoken"

const SECRET_KEY = "c0d3rs3cr3t"

export const createHash = password => bcrypt.hashSync(password, genSaltSync(10))

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) => {
    const token = jwt.sign({ ...user }, SECRET_KEY, { expiresIn: '24h' })
    return token;
};
  
export const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies){
        token = req.cookies["CoderCookie"]
    }
    return token
}
  

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;