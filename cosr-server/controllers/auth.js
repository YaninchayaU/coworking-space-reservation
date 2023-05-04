const User = require("../models/User");

//@desc     Reh=gister user
//@route    Post /cosr/api/auth/register
//@access   Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, telephoneNumber, role } = req.body;

    //Create user
    const user = await User.create({
      name,
      email,
      password,
      telephoneNumber,
      role,
    });
    //Create token
    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false, msg: `${err}` });
    console.log(err.stack);
  }
};

//@desc Login user
//@route POST /api/auth/login
//@access Public

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    //Validate email & password

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, msg: "Please provide an email and password" });
    }

    //check for user
    const user = await User.findOne({ email }).select("+password");
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //check if password matches

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, msg: "Invalid credentials" });
    }

    //Create token

    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);

    //   sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

//@desc   Get current Logged in user
//@route  POST /api/auth/me
//@access Private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

//@desc   Log user out / clear cookie
//@route  GET /api/auth/logout
//@access Private
exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
};
