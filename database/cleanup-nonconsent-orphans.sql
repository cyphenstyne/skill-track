-- ============================================================
-- Cleanup: remove outcome-tracking data for trainees without consent.
-- Learning records (addresses/courses/skills/certifications) are
-- intentionally kept - only employment/salary/follow-ups/non-placement
-- require tracking consent. Safe to re-run (idempotent).
-- Order matters: salary_history -> employment_records first.
-- ============================================================

-- Salary history via non-consent employment records
DELETE FROM salary_history sh
USING employment_records er
JOIN trainees t ON t.id = er.trainee_id
WHERE sh.employment_id = er.id
  AND t.consent_status = FALSE;

-- Employment records
DELETE FROM employment_records er
USING trainees t
WHERE er.trainee_id = t.id
  AND t.consent_status = FALSE;

-- Follow-ups
DELETE FROM follow_ups f
USING trainees t
WHERE f.trainee_id = t.id
  AND t.consent_status = FALSE;

-- Non-placement reports
DELETE FROM trainee_non_placement tnp
USING trainees t
WHERE tnp.trainee_id = t.id
  AND t.consent_status = FALSE;
