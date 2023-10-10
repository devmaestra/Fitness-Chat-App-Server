const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  locationZip: {
    type: String,
    required: true,
  },

  firstName: {
    // internally collected only
    type: String,
    required: false,
  },
  lastName: {
    // internally collected only
    type: String,
    required: false,
  },
  activityBio: {
    type: String,
    required: false,
  },
  bioParagraph: {
    type: String,
  },
  userImage: {
    type: String, //! or and Array of Strings pointing to URLs
  },
  friends: {
    type: [String], //! array of ObjectId or username of all conversations?
  },
  active: {
    // change to "visible" ?
    type: Boolean,
    required: true,
  },
  admin: {
    // change to "visible" ?
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model("User", UserSchema);
