const express = require("express");
const router = express.Router();

const uid2 = require("uid2");
const encBase64 = require("crypto-js/enc-base64");
const SHA256 = require("crypto-js/sha256");

const Traveller = require("../models/Traveller");

// 1. Créer un nouveau voyageur
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (password.length < 8) {
      return res
        .status(400)
        .json("Le mot de passe doit faire au moins 8 caractères.");
    }
    const emailAlreadyUsed = await Traveller.findOne({
      email,
    });
    if (emailAlreadyUsed !== null) {
      return res
        .status(400)
        .json({ message: "Un compte existe déjà avec cette adresse email." });
    }
    const salt = uid2(24);
    const token = uid2(18);
    const newTraveller = new Traveller({
      username,
      email,
      token,
      salt,
      hash: SHA256(password + salt).toString(encBase64),
    });
    return res.status(200).json(` Nouveau voyageur créé: ${newTraveller}`);
  } catch (error) {
    res.status(400).json(error);
  }
  res.status(200).json({ message: "infos bien reçues" });
});

module.exports = router;
