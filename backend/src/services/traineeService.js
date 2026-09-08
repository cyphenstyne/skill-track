const pool = require("../config/db");

async function getTrainees() {
    const result = await pool.query(`
        SELECT
            t.id,
            t.name,
            t.last_educational_qualification,
            t.consent_status,
            ta.city,
            ta.district,
            ta.state
        FROM trainees t
        LEFT JOIN trainee_addresses ta
            ON ta.trainee_id = t.id
        ORDER BY t.id
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        qualification: row.last_educational_qualification,
        consentStatus: row.consent_status,
        city: row.city,
        district: row.district,
        state: row.state
    }));
}

async function getTraineeById(id) {
    const client = await pool.connect();

    try {
        const traineeResult = await client.query(
            `
            SELECT
                t.id,
                t.name,
                t.date_of_birth,
                t.last_educational_qualification,
                t.phone_primary,
                t.phone_secondary,
                t.consent_status,
                t.created_at,
                ta.address_line,
                ta.city,
                ta.district,
                ta.state,
                ta.pincode
            FROM trainees t
            LEFT JOIN trainee_addresses ta
                ON ta.trainee_id = t.id
            WHERE t.id = $1
            `,
            [id]
        );

        if (traineeResult.rows.length === 0) {
            return null;
        }

        const trainee = traineeResult.rows[0];
        const hasConsent = Boolean(trainee.consent_status);

        const coursesResult = await client.query(
            `
            SELECT
                tc.id,
                tc.course_id,
                c.name,
                c.category,
                c.level,
                tp.name AS provider_name,
                tc.enrolled_at,
                tc.completed_at,
                tc.status
            FROM trainee_courses tc
            JOIN courses c
                ON c.id = tc.course_id
            JOIN training_providers tp
                ON tp.id = c.provider_id
            WHERE tc.trainee_id = $1
            ORDER BY tc.enrolled_at
            `,
            [id]
        );

        const skillsResult = await client.query(
            `
            SELECT
                s.id,
                s.name,
                s.category,
                ts.proficiency_level,
                ts.source
            FROM trainee_skills ts
            JOIN skills s
                ON s.id = ts.skill_id
            WHERE ts.trainee_id = $1
            ORDER BY s.name
            `,
            [id]
        );

        const certificationsResult = await client.query(
            `
            SELECT
                c.id,
                c.certificate_name,
                c.issued_at,
                c.score,
                crs.name AS course_name
            FROM certifications c
            JOIN courses crs
                ON crs.id = c.course_id
            WHERE c.trainee_id = $1
            ORDER BY c.issued_at
            `,
            [id]
        );

        const employmentResult = await client.query(
            `
            SELECT
                er.id,
                er.employer_id,
                e.name AS employer_name,
                e.industry,
                er.employment_type,
                er.role,
                er.start_date,
                er.end_date,
                er.status,
                er.verification_status,
                er.training_relevance,
                er.job_source
            FROM employment_records er
            LEFT JOIN employers e
                ON e.id = er.employer_id
            WHERE er.trainee_id = $1
            ORDER BY er.start_date NULLS LAST
            `,
            [id]
        );

        const salaryResult = await client.query(
            `
            SELECT
                sh.id,
                sh.employment_id,
                sh.salary_amount,
                sh.salary_period,
                sh.recorded_at
            FROM salary_history sh
            JOIN employment_records er
                ON er.id = sh.employment_id
            WHERE er.trainee_id = $1
            ORDER BY sh.recorded_at
            `,
            [id]
        );

        const followUpsResult = await client.query(
            `
            SELECT
                id,
                scheduled_at,
                completed_at,
                channel,
                employment_status,
                response_status
            FROM follow_ups
            WHERE trainee_id = $1
            ORDER BY scheduled_at
            `,
            [id]
        );

        const nonPlacementResult = await client.query(
            `
            SELECT
                tnp.reported_at,
                npr.id AS reason_id,
                npr.reason
            FROM trainee_non_placement tnp
            JOIN non_placement_reasons npr
                ON npr.id = tnp.reason_id
            WHERE tnp.trainee_id = $1
            ORDER BY tnp.reported_at
            `,
            [id]
        );

        return {
            id: Number(trainee.id),
            name: trainee.name,
            dateOfBirth: trainee.date_of_birth,
            qualification: trainee.last_educational_qualification,
            phonePrimary: trainee.phone_primary,
            phoneSecondary: trainee.phone_secondary,
            consentStatus: trainee.consent_status,
            createdAt: trainee.created_at,

            address: trainee.address_line
                ? {
                      addressLine: trainee.address_line,
                      city: trainee.city,
                      district: trainee.district,
                      state: trainee.state,
                      pincode: trainee.pincode
                  }
                : null,

            courses: coursesResult.rows.map((row) => ({
                id: Number(row.id),
                courseId: Number(row.course_id),
                name: row.name,
                category: row.category,
                level: row.level,
                providerName: row.provider_name,
                enrolledAt: row.enrolled_at,
                completedAt: row.completed_at,
                status: row.status
            })),

            skills: skillsResult.rows.map((row) => ({
                id: Number(row.id),
                name: row.name,
                category: row.category,
                proficiencyLevel: row.proficiency_level,
                source: row.source
            })),

            certifications: certificationsResult.rows.map((row) => ({
                id: Number(row.id),
                certificateName: row.certificate_name,
                issuedAt: row.issued_at,
                score: Number(row.score),
                courseName: row.course_name
            })),

            employment: hasConsent
                ? employmentResult.rows.map((row) => ({
                      id: Number(row.id),
                      employerId: row.employer_id
                          ? Number(row.employer_id)
                          : null,
                      employerName: row.employer_name,
                      industry: row.industry,
                      employmentType: row.employment_type,
                      role: row.role,
                      startDate: row.start_date,
                      endDate: row.end_date,
                      status: row.status,
                      verificationStatus: row.verification_status,
                      trainingRelevance: row.training_relevance,
                      jobSource: row.job_source
                  }))
                : [],

            salaryHistory: hasConsent
                ? salaryResult.rows.map((row) => ({
                      id: Number(row.id),
                      employmentId: Number(row.employment_id),
                      salaryAmount: Number(row.salary_amount),
                      salaryPeriod: row.salary_period,
                      recordedAt: row.recorded_at
                  }))
                : [],

            followUps: hasConsent
                ? followUpsResult.rows.map((row) => ({
                      id: Number(row.id),
                      scheduledAt: row.scheduled_at,
                      completedAt: row.completed_at,
                      channel: row.channel,
                      employmentStatus: row.employment_status,
                      responseStatus: row.response_status
                  }))
                : [],

            nonPlacement: hasConsent
                ? nonPlacementResult.rows.map((row) => ({
                      reasonId: Number(row.reason_id),
                      reason: row.reason,
                      reportedAt: row.reported_at
                  }))
                : []
        };
    } finally {
        client.release();
    }
}

module.exports = {
    getTrainees,
    getTraineeById
};