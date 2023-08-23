import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
	const token = req.cookies["coderCookie"]
	if(!token){
		return res.status(401).json({error: "Not Authenticated"})
	}
	jwt.verify(token, "coderUser", (error, credentials) => {
		if (error) {
			return res.status(403).json({ error: 'Not authorized'});
		}
		req.user = credentials;
		next();
	});
};

export default auth