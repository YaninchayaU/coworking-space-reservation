const express = require("express");
const {
  getCoworkingSpaces,
  getCoworkingSpace,
  createCoworkingSpaces,
  updateCoworkingSpace,
  deleteCoworkingSpace,
} = require("../constrollers/CoworkingSpace");

//Include other resource routers
const reservationRouter = require("./reservations");

const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

//Re-route into other resource routers
router.use("/:coworkingSpaceId/reservations/", reservationRouter);

//add all routes
router
  .route("/")
  .get(getCoworkingSpaces)
  .post(protect, authorize("admin"), createCoworkingSpaces);

router
  .route("/:id")
  .get(getCoworkingSpace)
  .put(protect, authorize("admin"), updateCoworkingSpace)
  .delete(protect, authorize("admin"), deleteCoworkingSpace);

module.exports = router;
