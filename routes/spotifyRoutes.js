const express = require("express");
const router = express.Router();
const {
  login,
  callback,
  getTopTracks,
  getNowPlaying,
  stopPlayback,
} = require("../controllers/spotifyController");

// OAuth
router.get("/auth/login", login);
router.get("/auth/callback", callback);

// Protected Route
router.get("/top-tracks", getTopTracks); // Show user's top 10 songs or tracks
router.get("/now-playing", getNowPlaying); // Show currently playing song on Spotify
router.post("/stop", stopPlayback); // Stop currently playing track

module.exports = router;
