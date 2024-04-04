const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");

const Travel = require("../models/Travel");
const Activity = require("../models/Activity");
const isAuthenticated = require("../middlewares/isAuthenticated");

// // 1. Sélectionner une nouvelle activité (/select)
// // 2. Schedule une nouvelle activité (/schedule)

// 1. Sélectionner une nouvelle activité (/select)
router.post("/select", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      category,
      city,
      price,
      website,
      opening_hours,
      picture,
      rate,
      address,
      google_id,
      travel,
    } = req.body;
    const status = "selected";
    // Vérifier que l'activité n'existe pas déjà
    let activity = "";
    const activityFound = await Activity.findOne({ google_id });
    if (!activityFound) {
      // Créer l'activité si elle n'existe pas
      const newActivity = new Activity({
        title,
        category,
        city,
        price,
        website,
        opening_hours,
        picture,
        rate,
        address,
        google_id,
      });
      await newActivity.save();
      activity = newActivity._id;
    } else {
      activity = activityFound._id;
    }
    // Ajouter l'activité au voyage avec un statut "selected"
    const travelFound = await Travel.findById(travel);
    const activities = travelFound.activities;
    activities.push({ activity, status });
    const travelUpdated = await Travel.findByIdAndUpdate(
      travel,
      { activities },
      { new: true }
    );
    return res.status(200).json(travelUpdated);
  } catch (error) {
    return res.status(400).json(error);
  }
});

// 2. Schedule une nouvelle activité (/schedule)
router.post("/schedule", isAuthenticated, async (req, res) => {
  try {
    const { schedule_day, schedule_duration, activity, travel } = req.body;
    const travelFound = await Travel.findById(travel);
    const activities = travelFound.activities;
    // chercher l'activité et mettre à jour son jour et sa durée.
    for (let a = 0; a < activities.length; a++) {
      if (JSON.stringify(activities[a].activity).slice(1, 25) === activity) {
        activities[a].schedule_day = schedule_day;
        activities[a].schedule_duration = schedule_duration;
      }
    }
    const travelUpdated = await Travel.findByIdAndUpdate(
      travel,
      { activities },
      { new: true }
    );
    return res.status(200).json(travelUpdated);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
