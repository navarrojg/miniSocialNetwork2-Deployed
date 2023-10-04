const express = require("express");

const app = express();

app.use("/api/posts", (req, res, next) => {
	const posts = [
		{
			id: "saffsdfsd",
			title: "new post",
			content: "some content",
		},
		{
			id: "xxxsfdxcvx",
			title: "new post 22144",
			content: "some content and more",
		},
	];
	res.status(200).json({
		message: "posts fetched succesfully!",
		posts: posts,
	});
});

module.exports = app;
