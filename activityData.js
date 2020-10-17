import mongoose from "mongoose";

const activitySchema = mongoose.Schema({
	eventTitle: String,
	eventDate: String,
	imageURL: String,
	description: String,
});

export default mongoose.model("activities", activitySchema);
