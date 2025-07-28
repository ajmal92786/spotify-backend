const axios = require("axios");
const spotifyAuth = require("../utils/spotifyAuth");

const login = (req, res) => {
  const loginURL = spotifyAuth.getLoginURL();
  console.log("Login URL: ", loginURL);

  res.redirect(loginURL);
};

const callback = async (req, res) => {
  const code = req.query.code;

  try {
    await spotifyAuth.exchangeCodeForToken(code);
    res.send("Login successful! Now go to /spotify/top/tracks");
  } catch (error) {
    console.error("Auth error:", error.response?.data || error.message);
    res.status(400).send("Authentication failed");
  }
};

module.exports = { login, callback, getTopTracks };
