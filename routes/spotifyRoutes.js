const express = require("express");
const router = express.Router();
const {
  login,
  callback,
  getTopTracks,
  getNowPlaying,
} = require("../controllers/spotifyController");

// OAuth
router.get("/auth/login", login);
router.get("/auth/callback", callback);

// Protected Route
router.get("/top-tracks", getTopTracks); // Show user's top 10 songs or tracks

module.exports = router;
