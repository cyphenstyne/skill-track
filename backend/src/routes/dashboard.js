const express = require("express");

const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.get("/summary", dashboardController.getSummary);
router.get("/employment", dashboardController.getEmployment);
router.get("/retention", dashboardController.getRetention);
router.get("/wages", dashboardController.getWages);
router.get("/districts", dashboardController.getDistricts);
router.get("/providers", dashboardController.getProviders);
router.get("/courses", dashboardController.getCourses);
router.get("/skill-gaps", dashboardController.getSkillGaps);
router.get("/non-placement", dashboardController.getNonPlacement);

module.exports = router;