import { Schema, model } from "mongoose"

const Post = new Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: false,
	},
	status: {
		type: String,
		default: "New",
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
})

export default model("Post", Post)
