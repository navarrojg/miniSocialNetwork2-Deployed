const mongoose = require("mongoose");

const postSchema = mongoose.schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
});
