const mongoose = require("mongoose");

const Travel = mongoose.model("Travel", {
  name: String,
  status: String,
  //   ongoing, done
  date_start: Date,
  date_end: Date,
  type: String,
  place: String,
  isShared: Boolean,
  categories: Array,
  activities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Traveller",
      },
      status: String,
      schedule_day: Date,
      schedule_duration: Number,
      // (in minutes)
    },
  ],
  travellers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Traveller",
    },
  ],
});
module.exports = Travel;
