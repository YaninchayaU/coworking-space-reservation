const Reservation = require("../models/Reservation");
const CoworkingSpace = require("../models/CoworkingSpace");

//@desc Get all reservation
//@route GET /api/reservation
//@access Public
exports.getReservations = async (req, res, next) => {
  let query;
  if (req.user.role !== "admin") {
    query = Reservation.find({ user: req.user.id }).populate({
      path: "coworkingSpace",
      select: "name address telephoneNumber",
    });
  } else {
    query = Reservation.find().populate({
      path: "coworkingSpace",
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

//@desc Get single reservation
//@route GET /api/reservation/:id
//@access Public
exports.getReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id).populate({
      path: "coworkingSpace",
      select: "name address telephoneNumber",
    });
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: reservation });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Reservation" });
  }
};

//@desc Add single reservation
//@route POST /api/coworkingSpaces/:coworkingSpaceId/reservations
//@access Private
exports.addReservation = async (req, res, next) => {
  try {
    req.body.coworkingSpace = req.params.coworkingSpaceId;
    const coworkingSpace = await CoworkingSpace.findById(
      req.params.coworkingSpaceId
    );
    console.log(coworkingSpace);
    if (!coworkingSpace) {
      return res.status(404).json({
        success: false,
        message: `No coworkingSpace with the id of ${req.params.coworkingSpaceId}`,
      });
    }

    const reservation = await Reservation.create(req.body);
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot create Reservation",
    });
  }
};
