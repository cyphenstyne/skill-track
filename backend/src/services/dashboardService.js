const pool = require("../config/db");

async function getSummary() {
    const result = await pool.query(`
        SELECT
            (SELECT COUNT(*) FROM trainees) AS total_trainees,

            (
                SELECT COUNT(*)
                FROM employment_records
                WHERE employment_type IN (
                    'employment',
                    'self-employment',
                    'apprenticeship'
                )
            ) AS working_trainees,

            (
                SELECT COUNT(*)
                FROM employment_records
                WHERE employment_type = 'unemployed'
            ) AS unemployed_trainees,

            (
                SELECT ROUND(AVG(salary_amount), 2)
                FROM salary_history
            ) AS average_salary,

            (
                SELECT COUNT(*)
                FROM employment_records
                WHERE verification_status = 'verified'
            ) AS verified_employment,

            (
                SELECT COUNT(*)
                FROM employment_records
                WHERE verification_status = 'unverified'
            ) AS unverified_employment
    `);

    const row = result.rows[0];

    return {
        totalTrainees: Number(row.total_trainees),
        workingTrainees: Number(row.working_trainees),
        unemployedTrainees: Number(row.unemployed_trainees),
        averageSalary: Number(row.average_salary),
        verifiedEmployment: Number(row.verified_employment),
        unverifiedEmployment: Number(row.unverified_employment)
    };
}

async function getEmployment() {
    const result = await pool.query(`
        SELECT
            employment_type,
            COUNT(*) AS count
        FROM employment_records
        GROUP BY employment_type
        ORDER BY employment_type
    `);

    return result.rows.map((row) => ({
        employmentType: row.employment_type,
        count: Number(row.count)
    }));
}

async function getRetention() {
    const result = await pool.query(`
        SELECT
            employment_status,
            COUNT(*) AS total_follow_ups,
            COUNT(*) FILTER (
                WHERE response_status = 'completed'
            ) AS completed_follow_ups,
            COUNT(*) FILTER (
                WHERE response_status = 'no_response'
            ) AS no_response_follow_ups
        FROM follow_ups
        GROUP BY employment_status
        ORDER BY employment_status
    `);

    return result.rows.map((row) => ({
        employmentStatus: row.employment_status,
        totalFollowUps: Number(row.total_follow_ups),
        completedFollowUps: Number(row.completed_follow_ups),
        noResponseFollowUps: Number(row.no_response_follow_ups)
    }));
}

async function getWages() {
    const result = await pool.query(`
        SELECT
            er.id AS employment_id,
            er.role,
            er.trainee_id,
            sh.salary_amount,
            sh.recorded_at
        FROM employment_records er
        JOIN salary_history sh
            ON sh.employment_id = er.id
        ORDER BY er.id, sh.recorded_at
    `);

    const grouped = new Map();

    for (const row of result.rows) {
        if (!grouped.has(row.employment_id)) {
            grouped.set(row.employment_id, {
                employmentId: Number(row.employment_id),
                traineeId: Number(row.trainee_id),
                role: row.role,
                records: []
            });
        }

        grouped.get(row.employment_id).records.push({
            salaryAmount: Number(row.salary_amount),
            recordedAt: row.recorded_at
        });
    }

    return Array.from(grouped.values());
}

async function getDistricts() {
    const result = await pool.query(`
        SELECT
            ta.district,
            COUNT(DISTINCT t.id) AS trainees,
            COUNT(DISTINCT er.id) FILTER (
                WHERE er.employment_type IN (
                    'employment',
                    'self-employment',
                    'apprenticeship'
                )
            ) AS working,
            COUNT(DISTINCT er.id) FILTER (
                WHERE er.employment_type = 'unemployed'
            ) AS unemployed
        FROM trainees t
        JOIN trainee_addresses ta
            ON ta.trainee_id = t.id
        LEFT JOIN employment_records er
            ON er.trainee_id = t.id
        GROUP BY ta.district
        ORDER BY ta.district
    `);

    return result.rows.map((row) => ({
        district: row.district,
        trainees: Number(row.trainees),
        working: Number(row.working),
        unemployed: Number(row.unemployed)
    }));
}

async function getProviders() {
    const result = await pool.query(`
        SELECT
            tp.id,
            tp.name,
            tp.provider_type,
            COUNT(DISTINCT c.id) AS courses,
            COUNT(DISTINCT tc.trainee_id) AS trainees
        FROM training_providers tp
        LEFT JOIN courses c
            ON c.provider_id = tp.id
        LEFT JOIN trainee_courses tc
            ON tc.course_id = c.id
        GROUP BY
            tp.id,
            tp.name,
            tp.provider_type
        ORDER BY tp.name
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        providerType: row.provider_type,
        courses: Number(row.courses),
        trainees: Number(row.trainees)
    }));
}

async function getCourses() {
    const result = await pool.query(`
        SELECT
            c.id,
            c.name,
            c.category,
            c.level,
            tp.name AS provider_name,
            COUNT(DISTINCT tc.trainee_id) AS enrolled,
            COUNT(DISTINCT tc.trainee_id) FILTER (
                WHERE tc.status = 'completed'
            ) AS completed,
            COUNT(DISTINCT tc.trainee_id) FILTER (
                WHERE tc.status = 'dropped'
            ) AS dropped,
            COUNT(DISTINCT tc.trainee_id) FILTER (
                WHERE tc.status = 'in_progress'
            ) AS in_progress
        FROM courses c
        JOIN training_providers tp
            ON tp.id = c.provider_id
        LEFT JOIN trainee_courses tc
            ON tc.course_id = c.id
        GROUP BY
            c.id,
            c.name,
            c.category,
            c.level,
            tp.name
        ORDER BY c.name
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        category: row.category,
        level: row.level,
        providerName: row.provider_name,
        enrolled: Number(row.enrolled),
        completed: Number(row.completed),
        dropped: Number(row.dropped),
        inProgress: Number(row.in_progress)
    }));
}

async function getSkillGaps() {
    const result = await pool.query(`
        SELECT
            s.id,
            s.name,
            s.category,
            COUNT(ts.trainee_id) AS trainee_count,
            COUNT(ts.trainee_id) FILTER (
                WHERE ts.proficiency_level = 'Beginner'
            ) AS beginner_count,
            COUNT(ts.trainee_id) FILTER (
                WHERE ts.proficiency_level = 'Intermediate'
            ) AS intermediate_count,
            COUNT(ts.trainee_id) FILTER (
                WHERE ts.proficiency_level = 'Advanced'
            ) AS advanced_count
        FROM skills s
        LEFT JOIN trainee_skills ts
            ON ts.skill_id = s.id
        GROUP BY
            s.id,
            s.name,
            s.category
        ORDER BY trainee_count ASC, s.name
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        category: row.category,
        traineeCount: Number(row.trainee_count),
        beginnerCount: Number(row.beginner_count),
        intermediateCount: Number(row.intermediate_count),
        advancedCount: Number(row.advanced_count)
    }));
}

async function getNonPlacement() {
    const result = await pool.query(`
        SELECT
            npr.id,
            npr.reason,
            COUNT(tnp.trainee_id) AS count
        FROM non_placement_reasons npr
        LEFT JOIN trainee_non_placement tnp
            ON tnp.reason_id = npr.id
        GROUP BY
            npr.id,
            npr.reason
        ORDER BY count DESC, npr.reason
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        reason: row.reason,
        count: Number(row.count)
    }));
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