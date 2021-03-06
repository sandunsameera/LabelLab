var express = require("express")
var passport = require("passport")
const router = express.Router()
const requireAuth = passport.authenticate("jwt", { session: false })

// Include controllers of each route
const labelControls = require("../../controller/label/labelControls")

// // POST method
// // To post image of a project
// router.post("/:image_id/create", requireAuth, labelControls.postLabel)

// POST method
// To post label of a project
router.post("/:project_id/create", requireAuth, labelControls.createLabel)

// PUT method
// To update label of a project
router.put("/:label_id/update", requireAuth, labelControls.updateLabel)

// GET method
// To fetch labels of a project
router.get("/:project_id/get", requireAuth, labelControls.fetchLabel)

module.exports = router
