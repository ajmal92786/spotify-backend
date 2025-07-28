const express = require("express");
const spotifyRoutes = require("./routes/spotifyRoutes");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/spotify", spotifyRoutes);

app.get("/", (req, res) => {
  res.json("Welcome to spotify api server");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
