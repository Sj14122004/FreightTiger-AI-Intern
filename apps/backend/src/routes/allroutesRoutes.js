const express = require("express");
const {
  getAllRoutesMetrics,
  generateAllRoutesAnalysis,
  downloadFinalOutput
} = require("../controllers/allroutesController");

const router = express.Router();

router.get("/metrics", getAllRoutesMetrics);
router.post("/generate", generateAllRoutesAnalysis);
router.get("/download", downloadFinalOutput);

module.exports = router;