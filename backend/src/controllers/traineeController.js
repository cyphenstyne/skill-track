const traineeService = require("../services/traineeService");

async function getTrainees(req, res) {
    try {
        const data = await traineeService.getTrainees();

        res.json(data);
    } catch (error) {
        console.error("Trainee listing error:", error);

        res.status(500).json({
            error: "Failed to fetch trainees"
        });
    }
}

async function getTraineeById(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid trainee ID"
            });
        }

        const trainee = await traineeService.getTraineeById(id);

        if (!trainee) {
            return res.status(404).json({
                error: "Trainee not found"
            });
        }

        res.json(trainee);
    } catch (error) {
        console.error("Trainee detail error:", error);

        res.status(500).json({
            error: "Failed to fetch trainee"
        });
    }
}

module.exports = {
    getTrainees,
    getTraineeById
};