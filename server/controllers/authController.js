import bcrypt from "bcryptjs"
import userModel from "../models/UserModel.js"
import activationLinkModel from "../models/ActivationLinkModel.js"
import tokenController from "./tokenController.js"
import mailService from "../services/mailService.js"
import { validationResult } from "express-validator"
import { v4 as uuidv4 } from "uuid"

class AuthController {
	register = async (req, res) => {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array()[0] })
		}

		try {
			const { email, password } = req.body
			const activationLink = uuidv4()
			const candidate = await userModel.findOne({ email })

			if (candidate) {
				return res.status(400).json({ message: `User with this email already exists` })
			}

			const hashPassword = bcrypt.hashSync(password, 7)
			const user = await userModel.create({
				email,
				password: hashPassword,
				isActivated: false,
			})

			await activationLinkModel.create({
				user: user._id,
				link: activationLink,
			})

			await mailService.sendActivationMail(
				email,
				`${process.env.API_URL}/api/activate/${activationLink}`
			)

			await this.login(req, res)
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: "Server error" })
		}
	}

	login = async (req, res) => {
		try {
			const { email, password } = req.body
			const user = await userModel.findOne({ email })

			if (!user) {
				return res.status(400).json({ message: `User with this email not found` })
			}

			const isPasswordCorrect = bcrypt.compareSync(password, user.password)
			if (!isPasswordCorrect) {
				return res.status(400).json({ message: "Wrong password" })
			}

			const sessionId = tokenController.generateSessionId()
			const token = tokenController.generateToken(
				{ email: user.email, id: user._id },
				sessionId
			)

			user.sessionId = sessionId
			await user.save()

			const userData = {
				id: user._id,
				email: user.email,
				isActivated: user.isActivated,
			}

			return res.status(200).json({ user: userData, token })
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: "Server error" })
		}
	}

	logout = async (req, res) => {
		try {
			const authHeader = req.headers.authorization
			if (!authHeader) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			const token = authHeader.split(" ")[1]
			if (!token) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			const decoded = tokenController.validateToken(token)
			if (!decoded) {
				return res.status(403).json({ message: "Token invalid or expired" })
			}

			const user = await userModel.findById(decoded.id)
			if (!user) {
				return res.status(404).json({ message: "User not found" })
			}

			user.sessionId = null
			await user.save()

			return res.status(200).json({ message: "Logout successful" })
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: "Server error" })
		}
	}

	activate = async (req, res) => {
		try {
			const link = req.params.link

			if (!link) {
				return res.status(400).json({ message: "Incorrect link" })
			}

			const activated = await activationLinkModel.findOne({ link })
			if (!activated) {
				return res.status(400).json({ message: "Incorrect link" })
			}

			const user = await userModel.findById(activated.user)
			user.isActivated = true
			await user.save()
			return res.json({ status: "success", message: "Email successfully activated" })
		} catch (e) {
			return res.status(500).json({ message: "Server error" })
		}
	}

	getUser = async (req, res) => {
		try {
			const authHeader = req.headers.authorization
			if (!authHeader) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			const token = authHeader.split(" ")[1]
			if (!token) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			const decoded = tokenController.validateToken(token)
			if (!decoded) {
				return res.status(403).json({ message: "Token invalid or expired" })
			}

			const user = await userModel.findById(decoded.id)
			if (!user || user.sessionId !== decoded.sessionId) {
				return res.status(403).json({ message: "Unauthorized" })
			}

			const userData = {
				id: user._id,
				email: user.email,
				isActivated: user.isActivated,
			}

			return res.status(200).json(userData)
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: "Server error" })
		}
	}
}

export default new AuthController()
