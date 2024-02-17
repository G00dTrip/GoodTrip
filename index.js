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
  console.log("search longitude/latitude");

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${req.query.address}&key=AIzaSyC40aX2jU-IpxXf7lDw__e6F3Z4_8KAOiE`
  );

  // console.log("response=", response.data.results[0].geometry.location);
  const test = 0;
  const lat = response.data.results[0].geometry.location.lat;
  // console.log("lat=", lat);
  const long = response.data.results[0].geometry.location.lng;
  // console.log("long=", long);

  const response2 = await axios.post(
    "https://places.googleapis.com/v1/places:searchNearby?key=AIzaSyC40aX2jU-IpxXf7lDw__e6F3Z4_8KAOiE",
    {
      includedTypes: ["restaurant"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: {
            latitude: lat,
            longitude: long,
          },
          radius: 5000.0,
        },
      },
    },
    {
      headers: {
        "X-Goog-FieldMask": [
          "places.displayName",
          "places.rating",
          "places.nationalPhoneNumber",
        ],
      },
    }
  );
  // console.log("response2=", response.data);
  res.status(200).json(response2.data);
});

app.listen(3000, () => {
  console.log("Server on fire!");
});
