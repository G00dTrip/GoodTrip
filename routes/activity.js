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
    const travelFound = await Travel.findById(req.body.travel);
    const activities = travelFound.activities;
    const status = "selected";
    const tab = req.body.tab;
    for (let t = 0; t < tab.length; t++) {
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
      } = tab[t];
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
      // Fonction pour vérifier si l'activité existe déjà dans le tableau
      function activityExists(activities, newActivity) {
        return activities.some(
          (activity) =>
            JSON.stringify(activity.activity).slice(1, 25) ===
            JSON.stringify(newActivity._id).slice(1, 25)
        );
      }
      if (!activityExists(activities, activity)) {
        activities.push({ activity, status });
      } else {
        console.log("L'activité existe déjà dans le tableau.");
      }
    }
    // Ajouter l'activité au voyage avec un statut "selected"
    const travelUpdated = await Travel.findByIdAndUpdate(
      req.body.travel,
      { activities },
      { new: true }
    );
    return res.status(200).json(travelUpdated);
  } catch (error) {
    console.log(error);
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

//Renvoyer les informations d'une activité
router.get("/activity/:activityId", isAuthenticated, async (req, res) => {
  const { activityId } = req.params;
  // console.log("activityId=", activityId);
  try {
    const activity = await Activity.findById(activityId);
    // console.log("activity=", activity);
    return res.status(200).json(activity);
  } catch (error) {
    console.log("Erreur lors de la récupération de l'activité", error);
  }
});

module.exports = router;
