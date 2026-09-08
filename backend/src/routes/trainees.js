const express = require("express");

const traineeController = require("../controllers/traineeController");

const router = express.Router();

router.get("/", traineeController.getTrainees);
router.post("/", traineeController.createTrainee);
router.get("/:id", traineeController.getTraineeById);

module.exports = router;