const dashboardService = require("../services/dashboardService");

async function getSummary(req, res) {
    try {
        const data = await dashboardService.getSummary();
        res.json(data);
    } catch (error) {
        console.error("Dashboard summary error:", error);

        res.status(500).json({
            error: "Failed to fetch dashboard summary"
        });
    }
}

async function getEmployment(req, res) {
    try {
        const data = await dashboardService.getEmployment();
        res.json(data);
    } catch (error) {
        console.error("Employment dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch employment data"
        });
    }
}

async function getRetention(req, res) {
    try {
        const data = await dashboardService.getRetention();
        res.json(data);
    } catch (error) {
        console.error("Retention dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch retention data"
        });
    }
}

async function getWages(req, res) {
    try {
        const data = await dashboardService.getWages();
        res.json(data);
    } catch (error) {
        console.error("Wages dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch wage data"
        });
    }
}

async function getDistricts(req, res) {
    try {
        const data = await dashboardService.getDistricts();
        res.json(data);
    } catch (error) {
        console.error("District dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch district data"
        });
    }
}

async function getProviders(req, res) {
    try {
        const data = await dashboardService.getProviders();
        res.json(data);
    } catch (error) {
        console.error("Provider dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch provider data"
        });
    }
}

async function getCourses(req, res) {
    try {
        const data = await dashboardService.getCourses();
        res.json(data);
    } catch (error) {
        console.error("Course dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch course data"
        });
    }
}

async function getSkillGaps(req, res) {
    try {
        const data = await dashboardService.getSkillGaps();
        res.json(data);
    } catch (error) {
        console.error("Skill-gap dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch skill-gap data"
        });
    }
}

async function getNonPlacement(req, res) {
    try {
        const data = await dashboardService.getNonPlacement();
        res.json(data);
    } catch (error) {
        console.error("Non-placement dashboard error:", error);

        res.status(500).json({
            error: "Failed to fetch non-placement data"
        });
    }
}

module.exports = {
    getSummary,
    getEmployment,
    getRetention,
    getWages,
    getDistricts,
    getProviders,
    getCourses,
    getSkillGaps,
    getNonPlacement
};