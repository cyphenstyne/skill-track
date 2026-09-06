const express = require("express");

const traineeController = require("../controllers/traineeController");

const router = express.Router();

router.get("/", traineeController.getTrainees);
router.get("/:id", traineeController.getTraineeById);

module.exports = router;