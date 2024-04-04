const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");

const Travel = require("../models/Travel");
const Traveller = require("../models/Traveller");
const isAuthenticated = require("../middlewares/isAuthenticated");

// // 1. Créer un nouveau voyage (/create)

// 1. Créer un nouveau voyage (/create)
router.post("/create", isAuthenticated, async (req, res) => {
  try {
    const travellerFound = req.travellerFound;
    const { name, date_start, date_end, type, place, isShared, categories } =
      req.body;
    const travellers = [travellerFound._id];
    const status = "ongoing";
    // Vérifier que les covoyageurs sont bien inscris en base de donnée.
    if (req.body.travellers) {
      for (let t = 0; t < req.body.travellers.length; t++) {
        const coTraveller = await Traveller.findOne({
          email: req.body.travellers[t],
        });
        if (coTraveller) {
          travellers.push(coTraveller._id);
        }
      }
    }
    // Intégrer requête API Google dans une boucle pour chaque élément de categories -> renvoyer les activités à proposer aux voyageurs
    const activities = [];

    // Créer le voyage
    const newTravel = new Travel({
      name,
      status,
      date_start,
      date_end,
      type,
      place,
      isShared,
      categories,
      travellers,
    });
    await newTravel.save();
    // Mettre à jour les voyageurs en intégrant le voyage à leur liste de voyages
    for (let t = 0; t < travellers.length; t++) {
      const traveller = await Traveller.findById(travellers[t]);
      const travels = traveller.travels;
      travels.push(newTravel._id);
      const travellerUpdated = await Traveller.findByIdAndUpdate(
        traveller._id,
        {
          travels,
        },
        { new: true }
      );
    }
    // Renvoyer au voyageur les informations de son voyage + les activités à sélectionner
    const response = { travel: newTravel, activities };
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
});

module.exports = router;
