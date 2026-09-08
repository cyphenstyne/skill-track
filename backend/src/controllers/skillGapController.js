const skillGapService = require("../services/skillGapService");

async function getRoles(req, res) {
    try {
        const data = await skillGapService.getRoles();
        res.json(data);
    } catch (error) {
        console.error("Skill-gap roles error:", error);
        res.status(500).json({ error: "Failed to fetch roles" });
    }
}

async function getRoleById(req, res) {
    try {
        const roleId = Number(req.params.id);
        if (!Number.isInteger(roleId) || roleId <= 0) {
            return res.status(400).json({ error: "Invalid role ID" });
        }

        const role = await skillGapService.getRoleById(roleId);
        if (!role) {
            return res.status(404).json({ error: "Role not found" });
        }

        res.json(role);
    } catch (error) {
        console.error("Skill-gap role detail error:", error);
        res.status(500).json({ error: "Failed to fetch role" });
    }
}

async function getTargetTrainees(req, res) {
    try {
        const { search, limit } = req.query;
        const data = await skillGapService.getTargetTrainees(search, limit);
        res.json(data);
    } catch (error) {
        console.error("Skill-gap trainees error:", error);
        res.status(500).json({ error: "Failed to fetch trainees" });
    }
}

async function calculate(req, res) {
    try {
        const traineeId = Number(req.query.traineeId);
        const roleIdRaw = req.query.roleId;

        if (!Number.isInteger(traineeId) || traineeId <= 0) {
            return res.status(400).json({ error: "traineeId is required" });
        }

        let roleId = null;
        if (roleIdRaw !== undefined && roleIdRaw !== "" && roleIdRaw !== null) {
            roleId = Number(roleIdRaw);
            if (!Number.isInteger(roleId) || roleId <= 0) {
                return res.status(400).json({ error: "Invalid roleId" });
            }
        }

        const result = await skillGapService.calculateGap(traineeId, roleId);

        if (result.error === "not_found_trainee") {
            return res.status(404).json({ error: "Trainee not found" });
        }
        if (result.error === "not_found_role") {
            return res.status(404).json({ error: "Role not found" });
        }
        if (result.error === "no_target_role") {
            return res.status(400).json({
                error: "Trainee has no target role. Select a role explicitly."
            });
        }

        res.json(result);
    } catch (error) {
        console.error("Skill-gap calculate error:", error);
        res.status(500).json({ error: "Failed to calculate skill gap" });
    }
}

async function getLeaderboard(req, res) {
    try {
        const { search, limit, roleId: roleIdRaw } = req.query;

        let roleId = null;
        if (roleIdRaw !== undefined && roleIdRaw !== "" && roleIdRaw !== null) {
            roleId = Number(roleIdRaw);
            if (!Number.isInteger(roleId) || roleId <= 0) {
                return res.status(400).json({ error: "Invalid roleId" });
            }
        }

        const data = await skillGapService.getLeaderboard(search, roleId, limit);
        res.json(data);
    } catch (error) {
        console.error("Skill-gap leaderboard error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
}

async function getOverview(req, res) {
    try {
        const data = await skillGapService.getOverview();
        res.json(data);
    } catch (error) {
        console.error("Skill-gap overview error:", error);
        res.status(500).json({ error: "Failed to fetch skill-gap overview" });
    }
}

module.exports = {
    getRoles,
    getRoleById,
    getTargetTrainees,
    getLeaderboard,
    calculate,
    getOverview
};
