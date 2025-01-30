import jwt from "jsonwebtoken"
import tokenController from "../controllers/tokenController.js"

const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ message: "Authorization header is missing" })
		}

		const token = authHeader.split(" ")[1]
		if (!token) {
			return res.status(401).json({ message: "Auth token not found" })
		}

		const isValid = tokenController.validateToken(token)
		if (!isValid) {
			return res.status(401).json({ message: "Invalid or expired token" })
		}

		req.user = isValid
		next()
	} catch (e) {
		console.error("Auth error:", e)
		res.status(500).json({ message: "Server error" })
	}
}

export default authMiddleware
