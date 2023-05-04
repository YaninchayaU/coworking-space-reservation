const express = require("express");
const { getReservations } = require("../controllers/reservations");

const router = express.Router({ mergeParams: true });
const { protect } = require("../middleware/auth");

router.route("/").get(protect, getReservations);

module.exports = router;
