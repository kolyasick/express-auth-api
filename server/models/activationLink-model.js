import { Schema, model } from "mongoose";

const ActivationLink = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	link: {
		type: String,
		unique: true,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export default model("ActivationLink", ActivationLink);
