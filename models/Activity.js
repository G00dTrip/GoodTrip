const mongoose = require("mongoose");

const Activity = mongoose.model("Activity", {
  title: String,
  category: String,
  city: String,
  price: Number,
  website: String,
  opening_hours: Array,
  picture: Object,
});
module.exports = Activity;
