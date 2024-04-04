const mongoose = require("mongoose");

const Activity = mongoose.model("Activity", {
  title: String,
  category: String,
  city: String,
  price: Number,
  website: String,
  opening_hours: Array,
  picture: String,
  rate: Number,
  address: String,
  google_id: String,
});
module.exports = Activity;
