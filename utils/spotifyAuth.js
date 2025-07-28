const querystring = require("querystring");
const axios = require("axios");
require("dotenv").config();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

let access_token = "";
let refresh_token = "";

const getLoginURL = () => {
  const scope =
    "user-top-read user-read-playback-state user-modify-playback-state";

  return (
    "https://accounts.spotify.com/authorize?" +
    querystring.stringify({
      response_type: "code",
      client_id,
      scope,
      redirect_uri,
    })
  );
};

const exchangeCodeForToken = async (code) => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "authorization_code",
      code,
      redirect_uri,
      client_id,
      client_secret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  access_token = response.data.access_token;
  refresh_token = response.data.refresh_token;

  console.log("Access Token: ", access_token);
  console.log("Refresh Token: ", refresh_token);

  return { access_token, refresh_token };
};

const getAccessToken = () => access_token;

const refreshAccessToken = async () => {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    querystring.stringify({
      grant_type: "refresh_token",
      refresh_token,
      client_id,
      client_secret,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  access_token = response.data.access_token;
  return access_token;
};

module.exports = {
  getLoginURL,
  exchangeCodeForToken,
  getAccessToken,
  refreshAccessToken,
};
