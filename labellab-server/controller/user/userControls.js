let User = require("../../models/user")

exports.userInfo = function(req, res) {
	User.findOne({
		email: req.user.email
	})
		.select("name email thumbnail googleId githubId username")
		.exec(function(err, user) {
			if (err) {
				return res.status(400).send({
					success: false,
					msg: "Unable to connect to database. Please try again.",
					error: err
				})
			}
			if (!user) {
				return res.status(400).send({ success: false, msg: "User not found" })
			} else {
				return res.json({ success: true, msg: "User Data Found", body: user })
			}
		})
}

exports.userUploadImage = function(req, res) {
	if (req && req.body && req.body.image && req.body.format) {
		let data = {
			id: req.user.id,
			email: req.user.email,
			img: req.body.image,
			format: req.body.format
		}
		let baseImg = data.img.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { thumbnail: `${data.id}.${ext}` }
		const url = `/public/img/${updateData.thumbnail}`
		require("fs").writeFile(
			`./public/img/${updateData.thumbnail}`,
			binaryData,
			function(err) {
				if (err) {
					return res
						.status(400)
						.send({ success: false, msg: "something went wrong" })
				} else {
					User.findOneAndUpdate(
						{
							email: data.email
						},
						updateData
					).exec(function(err) {
						if (err)
							return res.status(400).send({
								success: false,
								msg: "Unable To Upload Image. Please Try Again."
							})
						res.json({
							success: true,
							body: url,
							msg: "Image Uploaded Successfully."
						})
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}
