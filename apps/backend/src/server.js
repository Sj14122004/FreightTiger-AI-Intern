const express = require("express");
const cors = require("cors");
require("dotenv").config();

const allRoutesRoutes = require("./routes/allroutesRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "FreightTiger backend is running"
  });
});

app.use("/api/all-routes", allRoutesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});