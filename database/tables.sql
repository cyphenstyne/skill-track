-- ============================================================
-- SKILLPULSE - DATABASE SCHEMA
-- ============================================================

DROP TABLE IF EXISTS trainee_non_placement CASCADE;
DROP TABLE IF EXISTS follow_ups CASCADE;
DROP TABLE IF EXISTS salary_history CASCADE;
DROP TABLE IF EXISTS employment_records CASCADE;
DROP TABLE IF EXISTS employers CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS trainee_skills CASCADE;
DROP TABLE IF EXISTS trainee_courses CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS training_providers CASCADE;
DROP TABLE IF EXISTS non_placement_reasons CASCADE;
DROP TABLE IF EXISTS trainee_addresses CASCADE;
DROP TABLE IF EXISTS trainees CASCADE;


-- ============================================================
-- TRAINEES
-- ============================================================

CREATE TABLE trainees (
    id                             BIGSERIAL PRIMARY KEY,
    name                           VARCHAR(150) NOT NULL,
    date_of_birth                  DATE,
    last_educational_qualification VARCHAR(80),
    phone_primary                  VARCHAR(20),
    phone_secondary                VARCHAR(20),
    consent_status                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TRAINEE ADDRESSES
-- Current home address of the trainee
-- One current address per trainee
-- ============================================================

CREATE TABLE trainee_addresses (
    id           BIGSERIAL PRIMARY KEY,
    trainee_id   BIGINT NOT NULL UNIQUE REFERENCES trainees(id),
    address_line VARCHAR(250) NOT NULL,
    city         VARCHAR(100),
    district     VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(10),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- TRAINING PROVIDERS
-- ============================================================

CREATE TABLE training_providers (
    id            BIGSERIAL PRIMARY KEY,
    name          VARCHAR(200) NOT NULL,
    provider_type VARCHAR(80),
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ============================================================
-- COURSES
-- ============================================================

CREATE TABLE courses (
    id             BIGSERIAL PRIMARY KEY,
    provider_id    BIGINT NOT NULL REFERENCES training_providers(id),
    name           VARCHAR(200) NOT NULL,
    category       VARCHAR(100),
    duration_weeks INTEGER,
    level          VARCHAR(50)
);


-- ============================================================
-- SKILLS
-- ============================================================

CREATE TABLE skills (
    id       BIGSERIAL PRIMARY KEY,
    name     VARCHAR(120) UNIQUE NOT NULL,
    category VARCHAR(100)
);


-- ============================================================
-- TRAINEE ↔ COURSE
-- ============================================================

CREATE TABLE trainee_courses (
    id           BIGSERIAL PRIMARY KEY,
    trainee_id   BIGINT NOT NULL REFERENCES trainees(id),
    course_id    BIGINT NOT NULL REFERENCES courses(id),
    enrolled_at  DATE NOT NULL,
    completed_at DATE,
    status       VARCHAR(40) NOT NULL
);


-- ============================================================
-- TRAINEE ↔ SKILL
-- ============================================================

CREATE TABLE trainee_skills (
    trainee_id        BIGINT NOT NULL REFERENCES trainees(id),
    skill_id          BIGINT NOT NULL REFERENCES skills(id),
    proficiency_level VARCHAR(30),
    source             VARCHAR(50),
    PRIMARY KEY (trainee_id, skill_id)
);


-- ============================================================
-- CERTIFICATIONS
-- ============================================================

CREATE TABLE certifications (
    id               BIGSERIAL PRIMARY KEY,
    trainee_id       BIGINT NOT NULL REFERENCES trainees(id),
    course_id        BIGINT NOT NULL REFERENCES courses(id),
    certificate_name VARCHAR(200) NOT NULL,
    issued_at        DATE NOT NULL,
    score            NUMERIC(5,2)
);


-- ============================================================
-- EMPLOYERS
-- ============================================================

CREATE TABLE employers (
    id                  BIGSERIAL PRIMARY KEY,
    name                VARCHAR(200) NOT NULL,
    industry            VARCHAR(100),
    district            VARCHAR(100),
    verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified',
    verified_at         TIMESTAMPTZ
);


-- ============================================================
-- EMPLOYMENT RECORDS
-- ============================================================

CREATE TABLE employment_records (
    id                  BIGSERIAL PRIMARY KEY,
    trainee_id          BIGINT NOT NULL REFERENCES trainees(id),
    employer_id         BIGINT REFERENCES employers(id),
    employment_type     VARCHAR(40) NOT NULL,
    role                VARCHAR(150),
    start_date          DATE,
    end_date            DATE,
    status              VARCHAR(40) NOT NULL,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'unverified',

    -- How closely the job relates to the trainee's training
    training_relevance  VARCHAR(30),

    -- How the employment outcome was obtained
    job_source          VARCHAR(50)
);


-- ============================================================
-- SALARY HISTORY
-- ============================================================

CREATE TABLE salary_history (
    id             BIGSERIAL PRIMARY KEY,
    employment_id  BIGINT NOT NULL REFERENCES employment_records(id),
    salary_amount  NUMERIC(12,2) NOT NULL,
    salary_period  VARCHAR(30) NOT NULL DEFAULT 'monthly',
    recorded_at    DATE NOT NULL
);


-- ============================================================
-- FOLLOW-UPS
-- ============================================================

CREATE TABLE follow_ups (
    id                BIGSERIAL PRIMARY KEY,
    trainee_id        BIGINT NOT NULL REFERENCES trainees(id),
    scheduled_at      DATE NOT NULL,
    completed_at      DATE,
    channel           VARCHAR(30),
    employment_status VARCHAR(40),
    response_status   VARCHAR(30) NOT NULL
);


-- ============================================================
-- NON-PLACEMENT REASONS
-- ============================================================

CREATE TABLE non_placement_reasons (
    id     SERIAL PRIMARY KEY,
    reason VARCHAR(200) UNIQUE NOT NULL
);


-- ============================================================
-- TRAINEE ↔ NON-PLACEMENT REASON
-- ============================================================

CREATE TABLE trainee_non_placement (
    trainee_id  BIGINT NOT NULL REFERENCES trainees(id),
    reason_id   INTEGER NOT NULL REFERENCES non_placement_reasons(id),
    reported_at DATE NOT NULL,
    PRIMARY KEY (trainee_id, reason_id)
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_addresses_district
    ON trainee_addresses(district);

CREATE INDEX idx_courses_provider
    ON courses(provider_id);

CREATE INDEX idx_trainee_courses_trainee
    ON trainee_courses(trainee_id);

CREATE INDEX idx_trainee_courses_course
    ON trainee_courses(course_id);

CREATE INDEX idx_employment_trainee
    ON employment_records(trainee_id);

CREATE INDEX idx_employment_employer
    ON employment_records(employer_id);

CREATE INDEX idx_salary_employment
    ON salary_history(employment_id);

CREATE INDEX idx_followups_trainee
    ON follow_ups(trainee_id);
