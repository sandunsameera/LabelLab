let fs = require("fs")
const Image = require("../../models/image")
const Classification = require("../../models/classification")

exports.classify = function(req, res) {
	if (
		req &&
		req.body &&
		req.body.image &&
		req.body.format
	) {
		let data = {
			id: req.user.id,
			image: req.body.image,
			format: req.body.format,
			project: req.params.project_id
		}
		let baseImg = data.image.split(",")[1]
		let binaryData = new Buffer(baseImg, "base64")
		let ext = data.format.split("/")[1]
		let updateData = { image_url: `${data.id}${Date.now()}.${ext}` }

		fs.writeFile(
			`./public/classifications/${updateData.image_url}`,
			binaryData,
			async err => {
				if (err) {
					return res.status(400).send({ success: false, msg: err })
				} else {
					const newImage = new Image({
						image_url: updateData.image_url,
					})
					newImage.save(function(err, image) {
						if (err) {
							return res
								.status(400)
								.send({ success: false, msg: "Unable to Upload Image" })
						} else if (image._id) {
              // TODO - Integrate with the classification model
              return res.json({
                success: true,
                msg: "Image Successfully Classified",
                body: image
              })
						} else {
							return res.status(400).send({
								success: false,
								msg: "Image ID Not Found",
								body: image
							})
						}
					})
				}
			}
		)
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.fetchClassification = function(req, res) {
  Classification.find({
    user: req.user._id
  })
    .select("image_url created_at")
    .populate("label")
    .exec(function(err, classification) {
      if (err) {
        return res.status(400).send({
          success: false,
          msg: "Unable to connect to database. Please try again.",
          error: err
        })
      }
      if (!classification) {
        return res
          .status(400)
          .send({ success: false, msg: "Classifications not found" })
      } else {
        return res.json({
          success: true,
          msg: "Classification data Found",
          body: classification
        })
      }
    })
}

exports.fetchClassificationId = function(req, res) {
	if (req && req.params && req.params.classification_id) {
		Classification.find({
			_id: req.params.classification_id
		})
			.select("image_url created_at")
			.populate("label")
			.exec(function(err, classification) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
				if (!classification) {
					return res
						.status(400)
						.send({ success: false, msg: "Classification not found" })
				} else {
					return res.json({
						success: true,
						msg: "Classification Data Found",
						body: classification
					})
				}
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}

exports.deleteClassificationId = function(req, res) {
	if (req && req.params && req.params.classification_id) {
		Classification.deleteOne({
			_id: req.params.classification_id
		})
			.exec(function(err) {
				if (err) {
					return res.status(400).send({
						success: false,
						msg: "Unable to connect to database. Please try again.",
						error: err
					})
				}
        return res.json({
          success: true,
          msg: "Classification deleted"
        })
			})
	} else res.status(400).send({ success: false, msg: "Invalid Data" })
}