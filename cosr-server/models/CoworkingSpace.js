const mongoose = require("mongoose");
//CoworkingSpace information
//name, address, telephone number, open-close time
const CoworkingSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: ["true", "Please add a name"],
    unique: true,
    trim: true,
    maxLength: [50, "Name can not be more than 50 characters"],
  },
  address: {
    type: String,
    required: ["true", "Please add an address"],
  },
  telephoneNumber: {
    type: String,
    required: ["true", "Please add a telephone number"],
  },
  openTime: {
    type: String,
    required: ["true", "Please add open time"],
  },
  closeTime: {
    type: String,
    required: ["true", "Please add close time"],
  },
});

module.exports = mongoose.model("CoworkingSpace", CoworkingSpaceSchema);
