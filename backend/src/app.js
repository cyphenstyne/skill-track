const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboard");
const traineeRoutes = require("./routes/trainees");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok"
    });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/trainees", traineeRoutes);

app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

app.use((error, req, res, next) => {
    console.error("Unhandled error:", error);

    res.status(500).json({
        error: "Internal server error"
    });
});

module.exports = app;