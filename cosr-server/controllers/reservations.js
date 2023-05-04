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

    //add user Id to req.body
    req.body.user = req.user.id;

    //Check for existed appointment
    const existedReservation = await Reservation.find({ user: req.user.id });

    // If the user is not an admin, they can only create 3 appointment.
    if (existedReservation.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 reservations`,
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

//@desc Update reservation
//@route PUT /api/reservations/:id
//@access Private
exports.updateReservation = async (req, res, next) => {
  try {
    let reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the appointment owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this reservation`,
      });
    }

    reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: reservation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot update Reservation",
    });
  }
};

//@desc Delete reservation
//@route DELETE /api/reservations/:id
//@access Private
exports.deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: `No reservation with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the appointment owner
    if (
      reservation.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this bootcamp`,
      });
    }

    await reservation.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Cannot delete Reservation",
    });
  }
};
