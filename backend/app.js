const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./routes/posts");

const app = express();
// KSbnP3uSP0qJHFMH

mongoose
	.connect(
		"mongodb+srv://taras:KSbnP3uSP0qJHFMH@minisocialnetwork.utpskvt.mongodb.net/node-angular?retryWrites=true&w=majority"
	)
	.then(() => {
		console.log("Connected to DB!");
	})
	.catch(() => {
		console.log("Connection failed!");
	});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	next();
});

app.use("/api/posts", postRoutes);

module.exports = app;
