const axios = require("axios");
const spotifyAuth = require("../utils/spotifyAuth");

const login = (req, res) => {
  const loginURL = spotifyAuth.getLoginURL();
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

const getTopTracks = async (req, res) => {
  try {
    const accessToken = spotifyAuth.getAccessToken();
    // console.log("Access Token: ", accessToken);

    const response = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // console.log("Received response: ", response.data);

    const formattedTracks = response.data.items.map((track) => ({
      name: track.name,
      artist: track.artists.map((artist) => artist.name).join(", "),
      album: track.album.name,
      album_image: track.album.images[0]?.url,
      preview_url: track.preview_url,
      id: track.id,
    }));

    res.json({ topTracks: formattedTracks });
  } catch (error) {
    // If access token expired, refresh it and retry once
    if (error.response?.status === 401) {
      try {
        const newAccessToken = await spotifyAuth.refreshAccessToken();
        const retry = await axios.get(
          "https://api.spotify.com/v1/me/top/tracks?limit=10",
          {
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );

        const formattedTracks = retry.data.items.map((track) => ({
          name: track.name,
          artist: track.artists.map((a) => a.name).join(", "),
          album: track.album.name,
          album_image: track.album.images[0]?.url,
          preview_url: track.preview_url,
          id: track.id,
        }));

        return res.json({ topTracks: formattedTracks });
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError.message);
        return res
          .status(401)
          .json({ error: "Token expired. Please log in again." });
      }
    }

    console.error("Top Tracks Error:", error.message);
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
};

module.exports = { login, callback, getTopTracks, getNowPlaying };
