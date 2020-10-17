import mongoose from "mongoose";

const registerSchema = mongoose.Schema({
	uid: String,
	username: String,
	email: String,
	date: String,
	activityImage: String,
	activityTitle: String,
	description: String,
});

export default mongoose.model("register", registerSchema);
