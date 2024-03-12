require("dotenv").config();
const express = require("express");
const app = express();
const axios = require("axios");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", () => {
  console.log("coucou");
});

app.get("/search", async (req, res) => {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=${process.env.GOOGLE_API_KEY}`
  );
  const lat = response.data.results[0].geometry.location.lat;
  const long = response.data.results[0].geometry.location.lng;

  const response2 = await axios.post(
    `https://places.googleapis.com/v1/places:searchText?key=${process.env.GOOGLE_API_KEY}`,
    {
      textQuery: "eglise ancienne",
      // includedType: "visitor_center",
      strictTypeFiltering: true,
      locationBias: {
        circle: {
          center: {
            latitude: lat,
            longitude: long,
          },
          radius: 5000,
        },
      },
      minRating: 3,
    },
    {
      headers: {
        "X-Goog-FieldMask": [
          // "*",
          "places.displayName",
          "places.rating",
          "places.websiteUri",
          "places.regularOpeningHours.weekdayDescriptions",
          "places.primaryType",
          "places.shortFormattedAddress",
          "places.photos",
        ],
      },
    }
  );

  // const photo = await axios.get(
  //   `https://places.googleapis.com/v1/places/ChIJc8ANzMWzqxIRR3S9Qn7TQyc/photos/ATplDJbsR2yIuFnbB4_x46PolpSEnIXgMNeUfqwAN9yyxORIFW_IdmwxVaijLL64VUwtslhHMGHPU4hkdH0-TttJiq2vdfZ73nWKpifflgCUHcDYZeCo2Sc6qVn9Gs0TzVay_XoEp-cMOViAPHj-cr5Gq4RISPnUrCBgPJkk/media
  //   ?key=${process.env.GOOGLE_API_KEY}&maxHeightPx=1000&maxWidthPx=1000&skipHttpRedirect=true`
  // );

  res.status(200).json({
    count: response2.data.places.length,
    data: response2.data,
    // photo: photo,
  });
});

app.listen(3000, () => {
  console.log("Server on fire!");
});
