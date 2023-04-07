const express = require("express");
const {
  getCoworkingSpaces,
  getCoworkingSpace,
  createCoworkingSpaces,
  updateCoworkingSpace,
  deleteCoworkingSpace,
} = require("../constrollers/CoworkingSpace");
const router = express.Router();

//add all routes
router.route("/").get(getCoworkingSpaces).post(createCoworkingSpaces);

router
  .route("/:id")
  .get(getCoworkingSpace)
  .put(updateCoworkingSpace)
  .delete(deleteCoworkingSpace);

module.exports = router;
