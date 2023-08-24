// import { SECRET_KEY } from '../constants/constants';
const SECRET_KEY = "c0d3rs3cr3t"
const auth = (role) => {
	return async(req, res, next) => {
		if(!req.user){
			return res.status(401).json({error: "No authenticated"})
		}

		if(req.user.role !== role){
			return res.status(403).json({error: "Access Denied"})
		}
		next();
	}
};

export default auth