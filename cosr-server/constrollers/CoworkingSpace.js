const CoworkingSpace = require("../models/CoworkingSpace");
//@desc     Get all Coworking Spaces
//@route    Get /cosr/api/Coworking Spaces
//@access   Public
exports.getCoworkingSpaces = async (req, res, next) => {
  try {
    const coSpaces = await CoworkingSpace.find();
    res.status(200).json({ success: true, data: coSpaces });
  } catch (err) {
    res.status(400).json({ success: false, msg: `${err}` });
  }
};

//@desc     Get One Coworking Space
//@route    Get /cosr/api/Coworking Spaces/:id
//@access   Public
exports.getCoworkingSpace = async (req, res, next) => {
  try {
    const coSpace = await CoworkingSpace.findById(req.params.id);

    if (!coSpace) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: coSpace });
  } catch (err) {
    res.status(400).json({ success: false, msg: `${err}` });
  }
};

//@desc     Create Coworking Spaces
//@route    Post /cosr/api/Coworking Spaces
//@access   Public
exports.createCoworkingSpaces = async (req, res, next) => {
  const coSpace = await CoworkingSpace.create(req.body);
  res.status(200).json({ success: true, data: coSpace });
};

//@desc     Update One Coworking Space
//@route    Put /cosr/api/Coworking Spaces/:id
//@access   Public
exports.updateCoworkingSpace = async (req, res, next) => {
  try {
    const coSpace = await CoworkingSpace.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!coSpace) {
      return res.status(400).json({ success: false });
    }
    res
      .status(200)
      .json({ success: true, msg: `Update Coworking Space ${req.params.id}` });
  } catch (err) {
    res.status(400).json({ success: false, data: `${err}` });
  }
};

//@desc     Delete One Coworking Space
//@route    Delete /cosr/api/Coworking Spaces/:id
//@access   Public
exports.deleteCoworkingSpace = async (req, res, next) => {
  try {
    const coSpace = await CoworkingSpace.findByIdAndDelete(req.params.id);

    if (!coSpace) {
      return res.status(400).json({ success: false });
    }
    res
      .status(200)
      .json({ success: true, msg: `Delete Coworking Space ${req.params.id}` });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
