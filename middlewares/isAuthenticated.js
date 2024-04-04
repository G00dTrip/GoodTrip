const Traveller = require("../models/Traveller");

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization.replace("Bearer ", "");
  const travellerFound = await Traveller.findOne({ token });
  if (travellerFound) {
    req.travellerFound = travellerFound;
    next();
  } else {
    return res.status(401).json("Accès non autorisé");
  }
};

module.exports = isAuthenticated;
