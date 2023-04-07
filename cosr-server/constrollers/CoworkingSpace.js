const CoworkingSpace = require("../models/CoworkingSpace");
//@desc     Get all Coworking Spaces
//@route    Get /cosr/api/Coworking Spaces
//@access   Public
exports.getCoworkingSpaces = (req, res, next) => {
  res.status(200).json({ sucess: true, msg: "Show all Coworking Spaces" });
};

//@desc     Get One Coworking Space
//@route    Get /cosr/api/Coworking Spaces/:id
//@access   Public
exports.getCoworkingSpace = (req, res, next) => {
  res
    .status(200)
    .json({ sucess: true, msg: `Show Coworking Space ${req.params.id}` });
};

//@desc     Create Coworking Spaces
//@route    Post /cosr/api/Coworking Spaces
//@access   Public
exports.createCoworkingSpaces = (req, res, next) => {
  console.log(req.body);
  res.status(200).json({ success: true, msg: "Create new Coworking Spaces" });
};

//@desc     Update One Coworking Space
//@route    Put /cosr/api/Coworking Spaces/:id
//@access   Public
exports.updateCoworkingSpace = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update Coworking Space ${req.params.id}` });
};

//@desc     Delete One Coworking Space
//@route    Delete /cosr/api/Coworking Spaces/:id
//@access   Public
exports.deleteCoworkingSpace = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete Coworking Space ${req.params.id}` });
};
