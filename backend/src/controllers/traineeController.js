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

async function createTrainee(req, res) {
    try {
        const body = req.body || {};

        const name =
            typeof body.name === "string" ? body.name.trim() : "";
        if (!name) {
            return res.status(400).json({
                error: "Trainee name is required"
            });
        }
        if (name.length > 150) {
            return res.status(400).json({
                error: "Trainee name must be 150 characters or fewer"
            });
        }

        // Optional date of birth: accept YYYY-MM-DD, reject invalid dates.
        let dateOfBirth = null;
        if (body.dateOfBirth != null && body.dateOfBirth !== "") {
            const parsed = new Date(body.dateOfBirth);
            if (Number.isNaN(parsed.getTime())) {
                return res.status(400).json({
                    error: "Invalid date of birth"
                });
            }
            dateOfBirth = body.dateOfBirth;
        }

        const qualification =
            typeof body.qualification === "string" && body.qualification.trim() !== ""
                ? body.qualification.trim()
                : typeof body.lastEducationalQualification === "string" &&
                    body.lastEducationalQualification.trim() !== ""
                  ? body.lastEducationalQualification.trim()
                  : null;
        if (qualification && qualification.length > 80) {
            return res.status(400).json({
                error: "Qualification must be 80 characters or fewer"
            });
        }

        const phonePrimary =
            typeof body.phonePrimary === "string" && body.phonePrimary.trim() !== ""
                ? body.phonePrimary.trim()
                : null;
        const phoneSecondary =
            typeof body.phoneSecondary === "string" && body.phoneSecondary.trim() !== ""
                ? body.phoneSecondary.trim()
                : null;
        for (const [label, value] of [
            ["Primary phone", phonePrimary],
            ["Secondary phone", phoneSecondary]
        ]) {
            if (value && value.length > 20) {
                return res.status(400).json({
                    error: `${label} must be 20 characters or fewer`
                });
            }
        }

        const consentStatus = Boolean(
            body.consentStatus ?? body.consent_status ?? body.consent ?? false
        );

        // Optional address. When supplied, addressLine/district/state are required
        // (NOT NULL in trainee_addresses).
        let address = null;
        if (body.address != null) {
            if (typeof body.address !== "object" || Array.isArray(body.address)) {
                return res.status(400).json({
                    error: "Invalid address"
                });
            }
            const addressLine =
                typeof body.address.addressLine === "string"
                    ? body.address.addressLine.trim()
                    : "";
            const district =
                typeof body.address.district === "string"
                    ? body.address.district.trim()
                    : "";
            const state =
                typeof body.address.state === "string"
                    ? body.address.state.trim()
                    : "";
            if (!addressLine || !district || !state) {
                return res.status(400).json({
                    error: "Address requires addressLine, district and state"
                });
            }
            address = {
                addressLine,
                city:
                    typeof body.address.city === "string" &&
                    body.address.city.trim() !== ""
                        ? body.address.city.trim()
                        : null,
                district,
                state,
                pincode:
                    typeof body.address.pincode === "string" &&
                    body.address.pincode.trim() !== ""
                        ? body.address.pincode.trim()
                        : null
            };
        }

        const created = await traineeService.createTrainee({
            name,
            dateOfBirth,
            qualification,
            phonePrimary,
            phoneSecondary,
            consentStatus,
            address
        });

        res.status(201).json(created);
    } catch (error) {
        console.error("Trainee creation error:", error);

        res.status(500).json({
            error: "Failed to create trainee"
        });
    }
}

module.exports = {
    getTrainees,
    getTraineeById,
    createTrainee
};