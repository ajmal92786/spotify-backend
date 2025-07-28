const express = require("express");
const router = express.Router();
const {
  login,
  callback,
  getTopTracks,
} = require("../controllers/spotifyController");

// OAuth
router.get("/auth/login", login);
router.get("/auth/callback", callback);

module.exports = router;
