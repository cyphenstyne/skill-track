const express = require("express");

const skillGapController = require("../controllers/skillGapController");

const router = express.Router();

router.get("/overview", skillGapController.getOverview);
router.get("/leaderboard", skillGapController.getLeaderboard);
router.get("/roles", skillGapController.getRoles);
router.get("/roles/:id", skillGapController.getRoleById);
router.get("/trainees", skillGapController.getTargetTrainees);
router.get("/calculate", skillGapController.calculate);

module.exports = router;
