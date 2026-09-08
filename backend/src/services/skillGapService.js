const pool = require("../config/db");

async function getRoles() {
    const result = await pool.query(`
        SELECT
            r.id,
            r.name,
            r.category,
            r.description,
            COUNT(rrs.skill_id) AS required_count,
            COUNT(rrs.skill_id) FILTER (WHERE rrs.is_core = TRUE) AS core_count
        FROM roles r
        LEFT JOIN role_required_skills rrs
            ON rrs.role_id = r.id
        GROUP BY r.id, r.name, r.category, r.description
        ORDER BY r.name
    `);

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        category: row.category,
        description: row.description,
        requiredCount: Number(row.required_count),
        coreCount: Number(row.core_count)
    }));
}

async function getRoleById(roleId) {
    const roleResult = await pool.query(
        `
        SELECT id, name, category, description
        FROM roles
        WHERE id = $1
        `,
        [roleId]
    );

    if (roleResult.rows.length === 0) {
        return null;
    }

    const role = roleResult.rows[0];

    const skillsResult = await pool.query(
        `
        SELECT
            s.id AS skill_id,
            s.name AS skill_name,
            s.category AS skill_category,
            rrs.required_proficiency,
            rrs.is_core
        FROM role_required_skills rrs
        JOIN skills s
            ON s.id = rrs.skill_id
        WHERE rrs.role_id = $1
        ORDER BY rrs.is_core DESC, s.name
        `,
        [roleId]
    );

    return {
        id: Number(role.id),
        name: role.name,
        category: role.category,
        description: role.description,
        requiredSkills: skillsResult.rows.map((row) => ({
            skillId: Number(row.skill_id),
            skillName: row.skill_name,
            skillCategory: row.skill_category,
            requiredProficiency: row.required_proficiency,
            isCore: Boolean(row.is_core)
        }))
    };
}

async function getTargetTrainees(search, limit) {
    const params = [];
    let whereClause = "";

    if (search && search.trim() !== "") {
        params.push(`%${search.trim()}%`);
        whereClause = `WHERE t.name ILIKE $1`;
    }

    if (limit && Number.isInteger(Number(limit)) && Number(limit) > 0) {
        params.push(Math.min(Number(limit), 100));
    }

    const limitClause =
        params.length > 0 &&
        ((search && search.trim() !== "" && params.length === 2) ||
            (!(search && search.trim() !== "") && params.length === 1))
            ? `LIMIT $${params.length}`
            : "";

    const result = await pool.query(
        `
        SELECT
            t.id,
            t.name,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT(
                        'roleId', r.id,
                        'roleName', r.name,
                        'targetLevel', ttr.target_level
                    )
                    ORDER BY r.name
                ) FILTER (WHERE r.id IS NOT NULL),
                '[]'
            ) AS target_roles
        FROM trainees t
        LEFT JOIN trainee_target_roles ttr
            ON ttr.trainee_id = t.id
        LEFT JOIN roles r
            ON r.id = ttr.role_id
        ${whereClause}
        GROUP BY t.id, t.name
        ORDER BY t.id
        ${limitClause}
        `,
        params
    );

    return result.rows.map((row) => ({
        id: Number(row.id),
        name: row.name,
        targetRoles: (row.target_roles || []).map((tr) => ({
            roleId: Number(tr.roleId),
            roleName: tr.roleName,
            targetLevel: tr.targetLevel
        }))
    }));
}

async function calculateGap(traineeId, roleId) {
    const traineeResult = await pool.query(
        `SELECT id, name FROM trainees WHERE id = $1`,
        [traineeId]
    );

    if (traineeResult.rows.length === 0) {
        return { error: "not_found_trainee" };
    }

    let resolvedRoleId = roleId;

    // If no role given, fall back to the trainee's first target role.
    if (!resolvedRoleId) {
        const targetResult = await pool.query(
            `
            SELECT r.id, r.name
            FROM trainee_target_roles ttr
            JOIN roles r ON r.id = ttr.role_id
            WHERE ttr.trainee_id = $1
            ORDER BY r.name
            LIMIT 1
            `,
            [traineeId]
        );

        if (targetResult.rows.length === 0) {
            return { error: "no_target_role" };
        }

        resolvedRoleId = Number(targetResult.rows[0].id);
    }

    const roleResult = await pool.query(
        `SELECT id, name, category, description FROM roles WHERE id = $1`,
        [resolvedRoleId]
    );

    if (roleResult.rows.length === 0) {
        return { error: "not_found_role" };
    }

    const targetLevelResult = await pool.query(
        `
        SELECT target_level
        FROM trainee_target_roles
        WHERE trainee_id = $1 AND role_id = $2
        `,
        [traineeId, resolvedRoleId]
    );

    // Source of truth is the trainee_skill_gaps view:
    // one row per required skill with has/missing status.
    const gapsResult = await pool.query(
        `
        SELECT
            skill_id,
            skill_name,
            required_proficiency,
            is_core,
            skill_status,
            trainee_proficiency
        FROM trainee_skill_gaps
        WHERE trainee_id = $1 AND role_id = $2
        ORDER BY is_core DESC, skill_status ASC, skill_name
        `,
        [traineeId, resolvedRoleId]
    );

    // Trainee has no target-role row for an ad-hoc role selection:
    // fall back to comparing their skills against the role's requirements.
    let gaps = gapsResult.rows;
    if (gaps.length === 0) {
        const fallback = await pool.query(
            `
            SELECT
                s.id AS skill_id,
                s.name AS skill_name,
                rrs.required_proficiency,
                rrs.is_core,
                CASE WHEN ts.skill_id IS NULL THEN 'missing' ELSE 'has' END AS skill_status,
                ts.proficiency_level AS trainee_proficiency
            FROM role_required_skills rrs
            JOIN skills s ON s.id = rrs.skill_id
            LEFT JOIN trainee_skills ts
                ON ts.trainee_id = $1 AND ts.skill_id = s.id
            WHERE rrs.role_id = $2
            ORDER BY rrs.is_core DESC, skill_name
            `,
            [traineeId, resolvedRoleId]
        );
        gaps = fallback.rows;
    }

    const items = gaps.map((row) => ({
        skillId: Number(row.skill_id),
        skillName: row.skill_name,
        requiredProficiency: row.required_proficiency,
        isCore: Boolean(row.is_core),
        skillStatus: row.skill_status,
        traineeProficiency: row.trainee_proficiency
    }));

    const totalRequired = items.length;
    const hasCount = items.filter((i) => i.skillStatus === "has").length;
    const missingCount = totalRequired - hasCount;
    const coreTotal = items.filter((i) => i.isCore).length;
    const coreHas = items.filter((i) => i.isCore && i.skillStatus === "has").length;
    const coreMissing = coreTotal - coreHas;
    const readinessPct =
        totalRequired > 0 ? Math.round((hasCount / totalRequired) * 100) : 0;
    const coreReadinessPct =
        coreTotal > 0 ? Math.round((coreHas / coreTotal) * 100) : 0;

    const role = roleResult.rows[0];
    const trainee = traineeResult.rows[0];

    return {
        trainee: {
            id: Number(trainee.id),
            name: trainee.name
        },
        role: {
            id: Number(role.id),
            name: role.name,
            category: role.category,
            description: role.description,
            targetLevel:
                targetLevelResult.rows.length > 0
                    ? targetLevelResult.rows[0].target_level
                    : null,
            isTargetRole: targetLevelResult.rows.length > 0
        },
        summary: {
            totalRequired,
            hasCount,
            missingCount,
            coreTotal,
            coreHas,
            coreMissing,
            readinessPct,
            coreReadinessPct
        },
        gaps: items
    };
}

async function getOverview() {
    const rolesResult = await pool.query(`
        SELECT COUNT(*) AS count FROM roles
    `);

    const assignedResult = await pool.query(`
        SELECT COUNT(DISTINCT trainee_id) AS count FROM trainee_target_roles
    `);

    // Most-missing required skills across all assigned target roles.
    const missingResult = await pool.query(`
        SELECT
            skill_name,
            COUNT(*) FILTER (WHERE skill_status = 'missing') AS missing_count,
            COUNT(*) AS total_count
        FROM trainee_skill_gaps
        GROUP BY skill_name
        ORDER BY missing_count DESC, skill_name
        LIMIT 8
    `);

    // Average readiness per role (share of required skills trainees have).
    const readinessResult = await pool.query(`
        SELECT
            role_id,
            role_name,
            COUNT(*) AS total_checks,
            COUNT(*) FILTER (WHERE skill_status = 'has') AS has_checks,
            COUNT(DISTINCT trainee_id) AS trainees
        FROM trainee_skill_gaps
        GROUP BY role_id, role_name
        ORDER BY role_name
    `);

    return {
        totalRoles: Number(rolesResult.rows[0].count),
        traineesWithTargets: Number(assignedResult.rows[0].count),
        mostMissingSkills: missingResult.rows.map((row) => ({
            skillName: row.skill_name,
            missingCount: Number(row.missing_count),
            totalCount: Number(row.total_count)
        })),
        readinessByRole: readinessResult.rows.map((row) => ({
            roleId: Number(row.role_id),
            roleName: row.role_name,
            trainees: Number(row.trainees),
            totalChecks: Number(row.total_checks),
            hasChecks: Number(row.has_checks),
            readinessPct:
                Number(row.total_checks) > 0
                    ? Math.round(
                          (Number(row.has_checks) / Number(row.total_checks)) * 100
                      )
                    : 0
        }))
    };
}

async function getLeaderboard(search, roleId, limit) {
    const maxRows = Math.min(Number(limit) > 0 ? Number(limit) : 10, 100);
    const hasSearch = search && search.trim() !== "";

    // When a role is selected, rank (all) trainees by readiness for THAT
    // role — same ad-hoc comparison as calculateGap's fallback — so the
    // board answers "who is most ready for this role?".
    if (roleId !== null && roleId !== undefined) {
        const params = [roleId];
        let searchClause = "";
        if (hasSearch) {
            params.push(`%${search.trim()}%`);
            searchClause = `AND t.name ILIKE $${params.length}`;
        }
        params.push(maxRows);

        const result = await pool.query(
            `
            SELECT
                t.id AS trainee_id,
                t.name AS trainee_name,
                r.id AS role_id,
                r.name AS role_name,
                ttr.target_level,
                COUNT(rrs.skill_id) AS total_required,
                COUNT(ts.skill_id) AS has_count,
                COUNT(rrs.skill_id) FILTER (WHERE ts.skill_id IS NULL) AS missing_count,
                COUNT(rrs.skill_id) FILTER (WHERE rrs.is_core = TRUE) AS core_total,
                COUNT(rrs.skill_id) FILTER (WHERE rrs.is_core = TRUE AND ts.skill_id IS NOT NULL) AS core_has
            FROM trainees t
            JOIN roles r ON r.id = $1
            JOIN role_required_skills rrs ON rrs.role_id = r.id
            LEFT JOIN trainee_skills ts
                ON ts.trainee_id = t.id AND ts.skill_id = rrs.skill_id
            LEFT JOIN trainee_target_roles ttr
                ON ttr.trainee_id = t.id AND ttr.role_id = r.id
            WHERE 1 = 1 ${searchClause}
            GROUP BY t.id, t.name, r.id, r.name, ttr.target_level
            ORDER BY
                COUNT(ts.skill_id)::FLOAT / NULLIF(COUNT(rrs.skill_id), 0) DESC,
                t.name
            LIMIT $${params.length}
            `,
            params
        );

        return toLeaderboardRows(result.rows);
    }

    // No role selected: rank trainees by readiness for their own
    // assigned target role(s).
    const params = [];
    const conditions = [];

    if (hasSearch) {
        params.push(`%${search.trim()}%`);
        conditions.push(`t.name ILIKE $${params.length}`);
    }

    params.push(maxRows);
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const result = await pool.query(
        `
        SELECT
            t.id AS trainee_id,
            t.name AS trainee_name,
            r.id AS role_id,
            r.name AS role_name,
            ttr.target_level,
            COUNT(g.skill_id) AS total_required,
            COUNT(g.skill_id) FILTER (WHERE g.skill_status = 'has') AS has_count,
            COUNT(g.skill_id) FILTER (WHERE g.skill_status = 'missing') AS missing_count,
            COUNT(g.skill_id) FILTER (WHERE g.is_core = TRUE) AS core_total,
            COUNT(g.skill_id) FILTER (WHERE g.is_core = TRUE AND g.skill_status = 'has') AS core_has
        FROM trainee_target_roles ttr
        JOIN trainees t ON t.id = ttr.trainee_id
        JOIN roles r ON r.id = ttr.role_id
        JOIN trainee_skill_gaps g ON g.trainee_id = ttr.trainee_id AND g.role_id = ttr.role_id
        ${whereClause}
        GROUP BY t.id, t.name, r.id, r.name, ttr.target_level
        ORDER BY
            (COUNT(g.skill_id) FILTER (WHERE g.skill_status = 'has'))::FLOAT
                / NULLIF(COUNT(g.skill_id), 0) DESC,
            missing_count ASC,
            t.name
        LIMIT $${params.length}
        `,
        params
    );

    return toLeaderboardRows(result.rows);
}

function toLeaderboardRows(rows) {
    return rows.map((row, index) => {
        const total = Number(row.total_required);
        const has = Number(row.has_count);
        const coreTotal = Number(row.core_total);
        const coreHas = Number(row.core_has);
        return {
            rank: index + 1,
            traineeId: Number(row.trainee_id),
            traineeName: row.trainee_name,
            roleId: Number(row.role_id),
            roleName: row.role_name,
            targetLevel: row.target_level,
            totalRequired: total,
            hasCount: has,
            missingCount: Number(row.missing_count),
            coreTotal,
            coreHas,
            coreMissing: coreTotal - coreHas,
            readinessPct: total > 0 ? Math.round((has / total) * 100) : 0,
            coreReadinessPct: coreTotal > 0 ? Math.round((coreHas / coreTotal) * 100) : 0
        };
    });
}

module.exports = {
    getRoles,
    getRoleById,
    getTargetTrainees,
    getLeaderboard,
    calculateGap,
    getOverview
};
