import { Schema, model } from "mongoose";

const User = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	isActivated: {
		type: Boolean,
		default: false,
	},
	sessionId: {
		type: String,
		default: null,
	},
});

export default model("User", User);
