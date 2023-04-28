const Reservation = require("../models/Reservation");

//@desc Get all reservation
//@route GET /api/reservation
//@access Public
exports.getReservations = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "coworkingspace",
      select: "name address",
    });
  } else {
    query = Reservation.find().populate({
      path: "coworkingspace",
      select: "name address",
    });
  }
  try {
    const reservations = await query;
    res.status(200).json({
      success: true,
      count: reservations.length,
      data: reservations,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};
