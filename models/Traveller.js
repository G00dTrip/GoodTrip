const mongoose = require("mongoose");

const Traveller = mongoose.model("Traveller", {
  username: String,
  email: String,
  token: String,
  hash: String,
  salt: String,
  travels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Travel",
    },
  ],
});
module.exports = Traveller;
