BEGIN;

DROP TABLE IF EXISTS platform_moderation_history CASCADE;
DROP TABLE IF EXISTS follow_up_logs CASCADE;
DROP TABLE IF EXISTS follow_ups CASCADE;
DROP TABLE IF EXISTS follow_up_batches CASCADE;
DROP TABLE IF EXISTS course_improvement_insights CASCADE;
DROP TABLE IF EXISTS course_enrolment_history CASCADE;
DROP TABLE IF EXISTS course_reviews CASCADE;
DROP TABLE IF EXISTS course_trainers CASCADE;
DROP TABLE IF EXISTS course_resources CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS trainee_resumes CASCADE;
DROP TABLE IF EXISTS trainee_projects CASCADE;
DROP TABLE IF EXISTS trainee_target_roles CASCADE;
DROP TABLE IF EXISTS role_required_skills CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS salary_history CASCADE;
DROP TABLE IF EXISTS employment_records CASCADE;
DROP TABLE IF EXISTS employers CASCADE;
DROP TABLE IF EXISTS certifications CASCADE;
DROP TABLE IF EXISTS trainee_skills CASCADE;
DROP TABLE IF EXISTS course_enrolments CASCADE;
DROP TABLE IF EXISTS course_skills CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS skills CASCADE;
DROP TABLE IF EXISTS course_providers CASCADE;
DROP TABLE IF EXISTS trainee_address CASCADE;
DROP TABLE IF EXISTS trainees CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP FUNCTION IF EXISTS set_updated_at() CASCADE;
DROP TYPE IF EXISTS non_placement_category CASCADE;
DROP TYPE IF EXISTS domain_category CASCADE;
DROP TYPE IF EXISTS education_level CASCADE;

CREATE TYPE education_level AS ENUM (
    '10TH',
    '12TH',
    'GRADUATION',
    'POST_GRADUATION',
    'PHD'
);

CREATE TYPE domain_category AS ENUM (
    'SOFTWARE_ENGINEERING',
    'WEB_DEVELOPMENT',
    'MOBILE_DEVELOPMENT',
    'GAME_DEVELOPMENT',
    'CLOUD_COMPUTING',
    'DEVOPS_SYSADMIN',
    'SYSTEMS_ENGINEERING',
    'CYBERSECURITY',
    'NETWORKING_TELECOM',
    'DATABASE_ADMINISTRATION',
    'IT_SUPPORT_HELP_DESK',
    'AI_MACHINE_LEARNING',
    'DATA_SCIENCE',
    'BUSINESS_ANALYTICS',
    'IOT',
    'ROBOTICS_AUTOMATION',
    'BLOCKCHAIN_WEB3',
    'AR_VR_SPATIAL_COMPUTING',
    'HARDWARE_ENGINEERING',
    'UI_UX_DESIGN',
    'QA_TESTING'
);

CREATE TYPE non_placement_category AS ENUM (
    'HIGHER_STUDIES',
    'EXAM_PREPARATION',
    'SKILL_GAP',
    'LACK_OF_OPPORTUNITIES',
    'PERSONAL_OR_FAMILY',
    'HEALTH',
    'OTHER'
);

CREATE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email         VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(30) NOT NULL
                  CHECK (role IN ('ADMIN', 'COURSE_PROVIDER', 'TRAINEE')),
    avatar_url    VARCHAR(500),
    is_active     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trainees (
    id                             BIGINT PRIMARY KEY
                                   REFERENCES users(id) ON DELETE CASCADE,
    name                           VARCHAR(150) NOT NULL,
    date_of_birth                  DATE,
    last_educational_qualification education_level,
    phone_primary                  VARCHAR(20),
    phone_secondary                VARCHAR(20),
    current_employment_status      VARCHAR(30) NOT NULL DEFAULT 'NOT_EMPLOYED'
                                   CHECK (current_employment_status IN (
                                       'FULL_TIME', 'PART_TIME', 'INTERNSHIP',
                                       'SELF_EMPLOYED', 'NOT_EMPLOYED'
                                   )),
    non_placement_reason_category  non_placement_category,
    non_placement_reason           TEXT,
    data_tracking_consent          BOOLEAN NOT NULL DEFAULT FALSE,
    consecutive_missed_emails      SMALLINT NOT NULL DEFAULT 0
                                   CHECK (consecutive_missed_emails >= 0),
    is_removed                     BOOLEAN NOT NULL DEFAULT FALSE,
    removal_type                   VARCHAR(30)
                                   CHECK (removal_type IN ('KICKED', 'MISSED_EMAILS', 'SELF_REQUESTED')),
    removal_reason                 TEXT,
    removed_by                     BIGINT REFERENCES users(id) ON DELETE SET NULL,
    removed_at                     TIMESTAMPTZ,
    created_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_trainee_removal_state
        CHECK (
            (
                NOT is_removed
                AND phone_primary IS NOT NULL
                AND removal_type IS NULL
                AND removal_reason IS NULL
                AND removed_by IS NULL
                AND removed_at IS NULL
            )
            OR (
                is_removed
                AND removal_type IS NOT NULL
                AND removal_reason IS NOT NULL
                AND removed_at IS NOT NULL
                AND NOT data_tracking_consent
            )
        ),
    CONSTRAINT chk_trainee_non_placement
        CHECK (
            current_employment_status = 'NOT_EMPLOYED'
            OR (non_placement_reason_category IS NULL AND non_placement_reason IS NULL)
        )
);

CREATE TABLE trainee_address (
    id           BIGINT PRIMARY KEY
                 REFERENCES trainees(id) ON DELETE CASCADE,
    address_line VARCHAR(250) NOT NULL,
    city         VARCHAR(100),
    district     VARCHAR(100) NOT NULL,
    state        VARCHAR(100) NOT NULL,
    pincode      VARCHAR(10) NOT NULL,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE course_providers (
    id              BIGINT PRIMARY KEY
                    REFERENCES users(id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    owner_name      VARCHAR(150) NOT NULL,
    provider_type   VARCHAR(50) NOT NULL
                    CHECK (provider_type IN ('GOVERNMENT', 'PRIVATE')),
    phone           VARCHAR(20) NOT NULL,
    description     TEXT,
    website_url     VARCHAR(255),
    avg_rating      NUMERIC(2,1) NOT NULL DEFAULT 0.0
                    CHECK (avg_rating >= 0.0 AND avg_rating <= 5.0),
    approval_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
                    CHECK (approval_status IN ('PENDING', 'APPROVED', 'REJECTED')),
    is_removed      BOOLEAN NOT NULL DEFAULT FALSE,
    removal_reason  TEXT,
    removed_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    removed_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_provider_removal_state
        CHECK (
            (
                NOT is_removed
                AND removal_reason IS NULL
                AND removed_by IS NULL
                AND removed_at IS NULL
            )
            OR (
                is_removed
                AND removal_reason IS NOT NULL
                AND removed_at IS NOT NULL
            )
        )
);

CREATE TABLE trainers (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    provider_id    BIGINT NOT NULL
                   REFERENCES course_providers(id) ON DELETE CASCADE,
    name           VARCHAR(150) NOT NULL,
    email          VARCHAR(255),
    phone          VARCHAR(20),
    specialization VARCHAR(200),
    bio            TEXT,
    avg_rating     NUMERIC(2,1) NOT NULL DEFAULT 0.0
                   CHECK (avg_rating >= 0.0 AND avg_rating <= 5.0),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_trainers_id_provider UNIQUE (id, provider_id)
);

CREATE TABLE skills (
    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     VARCHAR(120) UNIQUE NOT NULL,
    category domain_category NOT NULL
);

CREATE TABLE courses (
    id                         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    provider_id                BIGINT NOT NULL
                               REFERENCES course_providers(id) ON DELETE CASCADE,
    name                       VARCHAR(200) NOT NULL,
    description                TEXT,
    category                   domain_category NOT NULL,
    duration_weeks             INTEGER NOT NULL CHECK (duration_weeks > 0),
    level                      VARCHAR(30) NOT NULL
                               CHECK (level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    avg_rating                 NUMERIC(2,1) NOT NULL DEFAULT 0.0
                               CHECK (avg_rating >= 0.0 AND avg_rating <= 5.0),
    certificate_title          VARCHAR(200),
    certificate_preview_s3_key VARCHAR(500),
    is_available               BOOLEAN NOT NULL DEFAULT TRUE,
    created_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                 TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_courses_id_provider UNIQUE (id, provider_id)
);

CREATE TABLE course_resources (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    course_id     BIGINT NOT NULL
                  REFERENCES courses(id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    resource_type VARCHAR(30) NOT NULL
                  CHECK (resource_type IN ('VIDEO', 'PDF', 'DOCUMENT', 'LINK', 'OTHER')),
    resource_url  VARCHAR(1000) NOT NULL,
    thumbnail_url VARCHAR(1000),
    display_order SMALLINT NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    uploaded_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_video_thumbnail
        CHECK (resource_type <> 'VIDEO' OR thumbnail_url IS NOT NULL)
);

CREATE TABLE course_trainers (
    course_id   BIGINT NOT NULL,
    trainer_id  BIGINT NOT NULL,
    provider_id BIGINT NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (course_id, trainer_id),

    CONSTRAINT fk_course_trainers_course_provider
        FOREIGN KEY (course_id, provider_id)
        REFERENCES courses(id, provider_id) ON DELETE CASCADE,
    CONSTRAINT fk_course_trainers_trainer_provider
        FOREIGN KEY (trainer_id, provider_id)
        REFERENCES trainers(id, provider_id) ON DELETE CASCADE
);

CREATE TABLE course_skills (
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    skill_id  BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    PRIMARY KEY (course_id, skill_id)
);

CREATE TABLE course_enrolments (
    id                 BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainee_id         BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    course_id          BIGINT NOT NULL REFERENCES courses(id) ON DELETE RESTRICT,
    enrolled_at        DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_at       DATE,
    terminated_at      TIMESTAMPTZ,
    terminated_by      BIGINT REFERENCES users(id) ON DELETE SET NULL,
    status             VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS'
                       CHECK (status IN ('IN_PROGRESS', 'COMPLETED', 'DROPPED', 'KICKED')),
    termination_reason TEXT,
    provider_remark    TEXT,
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_enrolment_termination
        CHECK (
            (
                status NOT IN ('DROPPED', 'KICKED')
                AND termination_reason IS NULL
                AND terminated_at IS NULL
                AND terminated_by IS NULL
            )
            OR (
                status IN ('DROPPED', 'KICKED')
                AND termination_reason IS NOT NULL
                AND terminated_at IS NOT NULL
            )
        ),
    CONSTRAINT chk_enrolment_completion
        CHECK ((status = 'COMPLETED') = (completed_at IS NOT NULL)),
    CONSTRAINT chk_enrolment_dates
        CHECK (completed_at IS NULL OR completed_at >= enrolled_at),
    UNIQUE (trainee_id, course_id)
);

CREATE TABLE course_enrolment_history (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    enrolment_id BIGINT NOT NULL
                 REFERENCES course_enrolments(id) ON DELETE CASCADE,
    old_status   VARCHAR(30)
                 CHECK (old_status IN ('IN_PROGRESS', 'COMPLETED', 'DROPPED', 'KICKED')),
    new_status   VARCHAR(30) NOT NULL
                 CHECK (new_status IN ('IN_PROGRESS', 'COMPLETED', 'DROPPED', 'KICKED')),
    reason       TEXT,
    changed_by   BIGINT REFERENCES users(id) ON DELETE SET NULL,
    changed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_enrolment_history_status_change
        CHECK (old_status IS NULL OR old_status <> new_status),
    CONSTRAINT chk_enrolment_history_reason
        CHECK (new_status NOT IN ('DROPPED', 'KICKED') OR reason IS NOT NULL)
);

CREATE TABLE course_reviews (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainee_id BIGINT NOT NULL,
    course_id  BIGINT NOT NULL,
    rating     SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    review     TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_course_review_enrolment
        FOREIGN KEY (trainee_id, course_id)
        REFERENCES course_enrolments(trainee_id, course_id)
        ON DELETE CASCADE,
    CONSTRAINT uq_course_review_trainee_course
        UNIQUE (trainee_id, course_id)
);

CREATE TABLE course_improvement_insights (
    course_id             BIGINT PRIMARY KEY
                          REFERENCES courses(id) ON DELETE CASCADE,
    summary               TEXT NOT NULL,
    suggested_topics      JSONB,
    based_on_review_count INTEGER NOT NULL DEFAULT 0 CHECK (based_on_review_count >= 0),
    generated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trainee_skills (
    trainee_id        BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    skill_id          BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(30) NOT NULL DEFAULT 'BEGINNER'
                      CHECK (proficiency_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    source            VARCHAR(30) NOT NULL
                      CHECK (source IN ('COURSE_COMPLETION', 'ASSESSMENT', 'SELF_REPORTED', 'RESUME_ATS')),
    acquired_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (trainee_id, skill_id)
);

CREATE TABLE certifications (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainee_id       BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    course_id        BIGINT REFERENCES courses(id) ON DELETE RESTRICT,
    certificate_name VARCHAR(200) NOT NULL,
    file_s3_key      VARCHAR(500) UNIQUE NOT NULL,
    issued_at        DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE (trainee_id, course_id)
);

CREATE TABLE trainee_projects (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainee_id  BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    title       VARCHAR(200) NOT NULL,
    description TEXT,
    repo_url    VARCHAR(500) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trainee_resumes (
    id               BIGINT PRIMARY KEY
                     REFERENCES trainees(id) ON DELETE CASCADE,
    file_s3_key      VARCHAR(500) NOT NULL,
    extracted_tokens JSONB,
    uploaded_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name        VARCHAR(150) UNIQUE NOT NULL,
    category    domain_category NOT NULL,
    description TEXT,
    is_emerging BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE role_required_skills (
    role_id              BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    skill_id             BIGINT NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_proficiency VARCHAR(30) NOT NULL DEFAULT 'INTERMEDIATE'
                         CHECK (required_proficiency IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    PRIMARY KEY (role_id, skill_id)
);

CREATE TABLE trainee_target_roles (
    trainee_id   BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    role_id      BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    target_level VARCHAR(50) NOT NULL DEFAULT 'ENTRY_LEVEL'
                 CHECK (target_level IN ('INTERN', 'ENTRY_LEVEL', 'JUNIOR', 'MID_LEVEL', 'SENIOR')),
    PRIMARY KEY (trainee_id, role_id)
);

CREATE TABLE employers (
    id       BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name     VARCHAR(200) UNIQUE NOT NULL,
    industry VARCHAR(100)
);

CREATE TABLE employment_records (
    id                  BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    trainee_id          BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    employer_id         BIGINT REFERENCES employers(id) ON DELETE SET NULL,
    role_id             BIGINT REFERENCES roles(id) ON DELETE SET NULL,
    employment_type     VARCHAR(30) NOT NULL
                        CHECK (employment_type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'SELF_EMPLOYED')),
    role_title          VARCHAR(150) NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE,
    is_current          BOOLEAN NOT NULL DEFAULT TRUE,
    verification_status VARCHAR(30) NOT NULL DEFAULT 'UNVERIFIED'
                        CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED')),
    training_relevance  VARCHAR(30)
                        CHECK (training_relevance IN ('HIGH', 'MEDIUM', 'LOW', 'UNRELATED')),
    job_source          VARCHAR(50)
                        CHECK (job_source IN ('SELF_REPORTED', 'TRAINING_PROVIDER', 'EMPLOYER', 'JOB_PORTAL')),

    CONSTRAINT chk_employment_dates
        CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT chk_employment_current
        CHECK (NOT is_current OR end_date IS NULL)
);

CREATE TABLE salary_history (
    id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    employment_id BIGINT NOT NULL REFERENCES employment_records(id) ON DELETE CASCADE,
    salary_amount NUMERIC(12,2) NOT NULL CHECK (salary_amount >= 0),
    salary_period VARCHAR(20) NOT NULL DEFAULT 'MONTHLY'
                  CHECK (salary_period IN ('MONTHLY', 'YEARLY')),
    recorded_at   DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE follow_up_batches (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at     TIMESTAMPTZ,
    triggered_by BIGINT REFERENCES users(id) ON DELETE SET NULL,

    CONSTRAINT chk_followup_batch_times
        CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE TABLE follow_ups (
    id                BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    batch_id          BIGINT REFERENCES follow_up_batches(id) ON DELETE SET NULL,
    trainee_id        BIGINT NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    scheduled_at      DATE NOT NULL,
    completed_at      DATE,
    employment_status VARCHAR(30)
                      CHECK (employment_status IN (
                          'FULL_TIME', 'PART_TIME', 'INTERNSHIP',
                          'SELF_EMPLOYED', 'NOT_EMPLOYED'
                      )),
    response_status   VARCHAR(30) NOT NULL DEFAULT 'PENDING'
                      CHECK (response_status IN ('PENDING', 'COMPLETED', 'NO_RESPONSE')),

    CONSTRAINT chk_followup_completion
        CHECK ((response_status = 'COMPLETED') = (completed_at IS NOT NULL))
);

CREATE TABLE follow_up_logs (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    follow_up_id         BIGINT NOT NULL
                         REFERENCES follow_ups(id) ON DELETE CASCADE,
    email_sent_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    email_status         VARCHAR(20) NOT NULL
                         CHECK (email_status IN ('SENT', 'FAILED')),
    email_subject        VARCHAR(255),
    response_received_at TIMESTAMPTZ,
    failure_reason       TEXT,

    CONSTRAINT chk_followup_log_status
        CHECK (
            (email_status = 'SENT' AND failure_reason IS NULL)
            OR (
                email_status = 'FAILED'
                AND failure_reason IS NOT NULL
                AND response_received_at IS NULL
            )
        ),
    CONSTRAINT chk_followup_log_response_time
        CHECK (response_received_at IS NULL OR response_received_at >= email_sent_at)
);

CREATE TABLE platform_moderation_history (
    id             BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    target_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action         VARCHAR(30) NOT NULL
                   CHECK (action IN ('APPROVED', 'REJECTED', 'KICKED', 'RESTORED', 'AUTO_REMOVED')),
    reason         TEXT,
    acted_by       BIGINT REFERENCES users(id) ON DELETE SET NULL,
    acted_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_moderation_reason
        CHECK (action NOT IN ('REJECTED', 'KICKED', 'AUTO_REMOVED') OR reason IS NOT NULL)
);

CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_trainees_updated_at
    BEFORE UPDATE ON trainees FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_trainee_address_updated_at
    BEFORE UPDATE ON trainee_address FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_course_providers_updated_at
    BEFORE UPDATE ON course_providers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_trainers_updated_at
    BEFORE UPDATE ON trainers FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_course_resources_updated_at
    BEFORE UPDATE ON course_resources FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_course_enrolments_updated_at
    BEFORE UPDATE ON course_enrolments FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER trg_course_reviews_updated_at
    BEFORE UPDATE ON course_reviews FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE UNIQUE INDEX uq_users_email_lower ON users (LOWER(email));
CREATE INDEX idx_users_role ON users(role);

CREATE INDEX idx_trainees_employment_status
    ON trainees(current_employment_status)
    WHERE NOT is_removed;
CREATE INDEX idx_trainees_non_placement_cat
    ON trainees(non_placement_reason_category)
    WHERE NOT is_removed AND current_employment_status = 'NOT_EMPLOYED';
CREATE INDEX idx_trainees_tracking_consent ON trainees(data_tracking_consent);
CREATE INDEX idx_trainees_platform_kicked
    ON trainees(removed_at DESC)
    WHERE is_removed AND removal_type = 'KICKED';
CREATE INDEX idx_address_district ON trainee_address(district);

CREATE INDEX idx_course_providers_pending
    ON course_providers(created_at DESC)
    WHERE approval_status = 'PENDING' AND NOT is_removed;
CREATE INDEX idx_course_providers_removed
    ON course_providers(removed_at DESC)
    WHERE is_removed;

CREATE INDEX idx_trainers_provider ON trainers(provider_id);
CREATE UNIQUE INDEX uq_trainers_provider_email_lower
    ON trainers(provider_id, LOWER(email))
    WHERE email IS NOT NULL;

CREATE INDEX idx_courses_provider ON courses(provider_id);
CREATE INDEX idx_courses_category ON courses(category);
CREATE INDEX idx_course_resources_course
    ON course_resources(course_id, resource_type, display_order)
    WHERE is_active;
CREATE INDEX idx_course_trainers_course_provider ON course_trainers(course_id, provider_id);
CREATE INDEX idx_course_trainers_trainer_provider ON course_trainers(trainer_id, provider_id);
CREATE INDEX idx_skills_category ON skills(category);
CREATE INDEX idx_course_skills_skill ON course_skills(skill_id);
CREATE INDEX idx_trainee_skills_skill ON trainee_skills(skill_id);

CREATE INDEX idx_enrolments_course_status ON course_enrolments(course_id, status);
CREATE INDEX idx_enrolments_status ON course_enrolments(status);
CREATE INDEX idx_enrolments_kicked_by_course
    ON course_enrolments(course_id, terminated_at DESC)
    WHERE status = 'KICKED';
CREATE INDEX idx_course_enrolment_history_enrolment
    ON course_enrolment_history(enrolment_id, changed_at DESC);
CREATE INDEX idx_course_enrolment_history_changed_by
    ON course_enrolment_history(changed_by);
CREATE INDEX idx_course_reviews_course ON course_reviews(course_id, created_at DESC);

CREATE INDEX idx_certifications_course
    ON certifications(course_id)
    WHERE course_id IS NOT NULL;
CREATE INDEX idx_projects_trainee ON trainee_projects(trainee_id);
CREATE INDEX idx_resumes_extracted_tokens ON trainee_resumes USING GIN (extracted_tokens);

CREATE INDEX idx_roles_emerging ON roles(id) WHERE is_emerging;
CREATE INDEX idx_role_req_skills_skill ON role_required_skills(skill_id);
CREATE INDEX idx_target_roles_role ON trainee_target_roles(role_id);

CREATE INDEX idx_employment_trainee ON employment_records(trainee_id);
CREATE INDEX idx_employment_employer ON employment_records(employer_id);
CREATE INDEX idx_employment_role ON employment_records(role_id);
CREATE INDEX idx_employment_type ON employment_records(employment_type);
CREATE INDEX idx_salary_employment ON salary_history(employment_id, recorded_at DESC);

CREATE INDEX idx_followup_batches_started ON follow_up_batches(started_at DESC);
CREATE INDEX idx_followups_batch_response
    ON follow_ups(batch_id, response_status)
    WHERE batch_id IS NOT NULL;
CREATE INDEX idx_followups_trainee ON follow_ups(trainee_id, scheduled_at DESC);
CREATE INDEX idx_followups_pending_schedule
    ON follow_ups(scheduled_at)
    WHERE response_status = 'PENDING';
CREATE INDEX idx_followup_logs_followup
    ON follow_up_logs(follow_up_id, email_sent_at DESC);
CREATE INDEX idx_followup_logs_failed
    ON follow_up_logs(follow_up_id)
    WHERE email_status = 'FAILED';

CREATE INDEX idx_moderation_target ON platform_moderation_history(target_user_id, acted_at DESC);
CREATE INDEX idx_moderation_actor ON platform_moderation_history(acted_by);

COMMIT;