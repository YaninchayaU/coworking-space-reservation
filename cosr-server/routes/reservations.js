const express = require("express");
const {
  getReservations,
  getReservation,
  addReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/reservations");

const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getReservations).post(addReservation);
router
  .route("/:id")
  .get(getReservation)
  .put(updateReservation)
  .delete(deleteReservation);

module.exports = router;
