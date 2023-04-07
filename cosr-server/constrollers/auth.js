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
    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(400).json({ success: false, msg: `${err}` });
    console.log(err.stack);
  }
};

//@desc Login user
//@route POST /api/v1/auth/login
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

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });

    //   sendTokenResponse(user, 200, res);
  } catch (err) {
    return res.status(401).json({
      success: false,
      msg: "Cannot convert email or password to string",
    });
  }
};
