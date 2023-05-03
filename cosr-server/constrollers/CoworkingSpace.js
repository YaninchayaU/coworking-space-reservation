const CoworkingSpace = require("../models/CoworkingSpace");
//@desc     Get all Coworking Spaces
//@route    Get /cosr/api/Coworking Spaces
//@access   Public
exports.getCoworkingSpaces = async (req, res, next) => {
  try {
    let query;

    //Copy req.query
    const reqQuery = { ...req.query };

    //Fields to exclude
    const removeFields = ["select", "sort", "page", "limit"];

    //Loop over remove fields and delete them from reqQuery
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    query = CoworkingSpace.find(JSON.parse(queryStr)).populate("reservations");

    //Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }
    //Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    //Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await CoworkingSpace.countDocuments();

    query = query.skip(startIndex).limit(limit);

    const coSpaces = await query;

    //Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: coSpaces.length,
      pagination,
      data: coSpaces,
    });
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
    console.log(coSpace);

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
    console(req.params.id, "-----req-----");
    const coSpace = await CoworkingSpace.findById(req.params.id);
    console(coSpace, "----------------");

    if (!coSpace)
      return res.status(404).json({
        success: false,
        message: `Bootcamp not found with id of ${req.params.id}`,
      });

    console(coSpace, "-----co------");
    coSpace.remove();
    console(coSpace, "-----af re------");
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};
