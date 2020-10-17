import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import admin from "firebase-admin";
import serviceAccount from "./firebaseKey.js";

import activitySchema from "./activityData.js";
import registerSchema from "./regiterData.js";

const app = express();
const port = process.env.PORT || 9001;

app.use(bodyParser.json());
app.use(cors());
dotenv.config();

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://volunteer-activity.firebaseio.com",
});

const mongoURI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.cojtp.mongodb.net/volunteeractivity?retryWrites=true&w=majority`;

mongoose.connect(mongoURI, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.post("/new/activity", (req, res) => {
	const dbData = req.body;
	activitySchema.create(dbData, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.post("/new/register", (req, res) => {
	const activityData = req.body;
	registerSchema.create(activityData, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.post("/new/activity", (req, res) => {
	const newActivityData = req.body;
	activitySchema.create(newActivityData, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(201).send(data);
		}
	});
});

app.get("/get/activityList", (req, res) => {
	activitySchema.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			let activities = [];
			data.map((activityData) => {
				const activityInfo = {
					id: activityData._id,
					name: activityData.eventTitle,
					photoURL: activityData.imageURL,
					description: activityData.description,
				};
				activities.push(activityInfo);
			});
			res.status(200).send(activities);
		}
	});
});

app.get("/get/userActivityList/:userId", (req, res) => {
	const userId = req.params.userId;
	const token = req.headers.authorization;
	if (token && token.startsWith("Bearer ")) {
		const idToken = token.split(" ")[1];
		admin
			.auth()
			.verifyIdToken(idToken)
			.then(function (decodedToken) {
				let uid = decodedToken.uid;
				if (uid === userId) {
					registerSchema.find({ uid: userId }, (err, data) => {
						if (err) {
							res.status(500).send(err);
						} else {
							let activities = [];
							data.map((activityData) => {
								const activityInfo = {
									date: activityData.date,
									title: activityData.activityTitle,
									photoURL: activityData.activityImage,
									description: activityData.description,
								};
								activities.push(activityInfo);
							});
							res.status(200).send(activities);
						}
					});
				}
			})
			.catch(function (error) {
				// Handle error
			});
	}
});

app.get("/get/allUserActivityList", (req, res) => {
	registerSchema.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			let activities = [];
			data.map((activityData) => {
				const activityInfo = {
					username: activityData.username,
					email: activityData.email,
					date: activityData.date,
					title: activityData.activityTitle,
				};
				activities.push(activityInfo);
			});
			res.status(200).send(activities);
		}
	});
});

app.delete("/delete/activity", (req, res) => {
	const title = req.query.title;

	registerSchema.deleteOne({ activityTitle: title }, (err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send("Deleted");
		}
	});
});

app.get("/", (req, res) => res.status(200).send("Hello to Backend"));

app.listen(port, () => console.log(`Port running at ${port}`));
