import { validationResult } from "express-validator"
import postModel from "../models/PostModel.js"
import userModel from "../models/UserModel.js"
import mongoose from "mongoose"

class PostController {
	async create(req, res) {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array()[0] })
		}

		try {
			const { title, description, userId } = req.body

			if (!mongoose.Types.ObjectId.isValid(userId))
				return res.json({ status: "error", message: "User with this id not found" })

			const post = await postModel.create({
				title,
				description,
				user: userId,
			})

			if (!post) return res.json({ status: "error", message: "Invalid credentials" })

			return res.json(post)
		} catch (e) {
			console.error(e)
			return res.status(500).json({ message: "Server error" })
		}
	}

	async findAll(req, res) {
		const posts = await postModel.find()

		if (!posts) return res.json({ status: "error", message: "Posts not found" })

		return res.json(posts)
	}

	async findOne(req, res) {
		const id = req.params.id

		if (!id) return res.json({ status: "error", message: "Id is required" })

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.json({ status: "error", message: "Post with this id not found" })

		const post = await postModel.findOne({ _id: id })
		return res.json(post)
	}

	async delete(req, res) {
		const id = req.params.id

		if (!id) return res.json({ status: "error", message: "Id is required" })

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.json({ status: "error", message: "Post with this id not found" })

		const post = await postModel.deleteOne({ _id: id })
		return res.json({ status: "success", message: "Post successfully deleted" })
	}

	async edit(req, res) {
		const id = req.params.id
		const { title, description } = req.body

		if (!id) return res.json({ status: "error", message: "Id is required" })

		if (!mongoose.Types.ObjectId.isValid(id))
			return res.json({ status: "error", message: "Post with this id not found" })

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ error: errors.array()[0] })
		}

		const post = await postModel.updateOne({ _id: id, title, description })
		return res.json({ status: "success", data: post })
	}
}

export default new PostController()
