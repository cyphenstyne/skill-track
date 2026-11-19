BEGIN;

TRUNCATE TABLE
    users,
    skills,
    roles,
    employers,
    follow_up_batches
RESTART IDENTITY CASCADE;

INSERT INTO users (id, email, password_hash, role, avatar_url, is_active)
OVERRIDING SYSTEM VALUE VALUES
    (1,  'admin@skilltrack.in',          '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN',           'https://cdn.skilltrack.in/avatars/admin-1.png',   TRUE),
    (2,  'contact@wbtechskills.gov.in',  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'COURSE_PROVIDER', 'https://cdn.skilltrack.in/avatars/provider-2.png', TRUE),
    (3,  'hello@cloudcraftacademy.in',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'COURSE_PROVIDER', 'https://cdn.skilltrack.in/avatars/provider-3.png', TRUE),
    (4,  'apply@nextgenlabs.in',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'COURSE_PROVIDER', NULL,                                               FALSE),
    (5,  'info@rapidcertbootcamps.in',   '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'COURSE_PROVIDER', NULL,                                               FALSE),
    (6,  'arjun.sen@example.in',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         'https://cdn.skilltrack.in/avatars/trainee-6.png',  TRUE),
    (7,  'priya.das@example.in',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         'https://cdn.skilltrack.in/avatars/trainee-7.png',  TRUE),
    (8,  'rohit.verma@example.in',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         'https://cdn.skilltrack.in/avatars/trainee-8.png',  TRUE),
    (9,  'sneha.roy@example.in',         '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         'https://cdn.skilltrack.in/avatars/trainee-9.png',  TRUE),
    (10, 'vikram.bose@example.in',       '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         NULL,                                               FALSE),
    (11, 'removed_11@anonymised.invalid','$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         NULL,                                               FALSE),
    (12, 'kabir.nair@example.in',        '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'TRAINEE',         'https://cdn.skilltrack.in/avatars/trainee-12.png', TRUE);

INSERT INTO trainees (
    id, name, date_of_birth, last_educational_qualification,
    phone_primary, phone_secondary, current_employment_status,
    non_placement_reason_category, non_placement_reason,
    data_tracking_consent, consecutive_missed_emails,
    is_removed, removal_type, removal_reason, removed_by, removed_at
) VALUES
    (6,  'Arjun Sen',     '2003-04-14', 'GRADUATION',      '+91-9830010001', NULL,            'FULL_TIME',     NULL,             NULL,                                                                                TRUE,  0, FALSE, NULL,            NULL,                                                                                NULL, NULL),
    (7,  'Priya Das',     '2004-08-22', 'GRADUATION',      '+91-9830010002', '+91-9830090002','INTERNSHIP',    NULL,             NULL,                                                                                TRUE,  1, FALSE, NULL,            NULL,                                                                                NULL, NULL),
    (8,  'Rohit Verma',   '2002-11-05', 'GRADUATION',      '+91-9830010003', NULL,            'NOT_EMPLOYED',  'SKILL_GAP',      'Building production deployment and query optimisation experience',                  TRUE,  0, FALSE, NULL,            NULL,                                                                                NULL, NULL),
    (9,  'Sneha Roy',     '2004-01-19', 'GRADUATION',      '+91-9830010004', NULL,            'NOT_EMPLOYED',  'HIGHER_STUDIES', 'Preparing for national postgraduate entrance examinations',                         FALSE, 0, FALSE, NULL,            NULL,                                                                                NULL, NULL),
    (10, 'Vikram Bose',   '2001-07-30', '12TH',            '+91-9830010005', NULL,            'NOT_EMPLOYED',  'OTHER',          'Suspended from platform placement services',                                        FALSE, 0, TRUE,  'KICKED',        'Repeated code of conduct breaches across platform channels',                        1,    '2026-10-18 14:30:00+05:30'),
    (11, 'Removed User',  NULL,         'GRADUATION',      NULL,             NULL,            'NOT_EMPLOYED',  NULL,             NULL,                                                                                FALSE, 3, TRUE,  'MISSED_EMAILS', 'No response to three consecutive follow-up emails; personal data erased',           NULL, '2026-11-12 09:00:00+05:30'),
    (12, 'Kabir Nair',    '2000-09-12', 'POST_GRADUATION', '+91-9830010007', NULL,            'SELF_EMPLOYED', NULL,             NULL,                                                                                TRUE,  0, FALSE, NULL,            NULL,                                                                                NULL, NULL);

INSERT INTO trainee_address (id, address_line, city, district, state, pincode) VALUES
    (6,  '14B Lake Gardens Road',       'Kolkata',  'Kolkata', 'West Bengal', '700045'),
    (7,  '22 Station Road, Uttarpara',  'Hooghly',  'Hooghly', 'West Bengal', '712258'),
    (8,  '88 Salt Lake Sector II',      'Kolkata',  'North 24 Parganas', 'West Bengal', '700091'),
    (9,  '7 Park Circus Connector',     'Kolkata',  'Kolkata', 'West Bengal', '700017'),
    (10, '45 GT Road, Serampore',       'Hooghly',  'Hooghly', 'West Bengal', '712201'),
    (12, '102 Ballygunge Circular Road','Kolkata',  'Kolkata', 'West Bengal', '700019');

INSERT INTO course_providers (
    id, name, owner_name, provider_type, phone, description, website_url,
    avg_rating, approval_status, is_removed, removal_reason, removed_by, removed_at
) VALUES
    (2, 'West Bengal Tech Skills Mission', 'Debashis Chatterjee', 'GOVERNMENT', '+91-33-22140100', 'State-backed technical training programmes focused on backend and database engineering.', 'https://wbtechskills.gov.in',   4.7, 'APPROVED', FALSE, NULL, NULL, NULL),
    (3, 'CloudCraft Academy',              'Nandini Rao',         'PRIVATE',    '+91-80-41209900', 'Hands-on cloud infrastructure, SRE, and applied AI cohorts.',                              'https://cloudcraftacademy.in',  4.7, 'APPROVED', FALSE, NULL, NULL, NULL),
    (4, 'NextGen AI Labs',                 'Raghav Kulkarni',     'PRIVATE',    '+91-22-66781200', 'Applied generative AI and data engineering training institute.',                           'https://nextgenlabs.in',        0.0, 'PENDING',  FALSE, NULL, NULL, NULL),
    (5, 'RapidCert Bootcamps',             'Sandeep Arora',       'PRIVATE',    '+91-11-49003300', 'Short-term web development cohorts.',                                                      'https://rapidcertbootcamps.in', 0.0, 'APPROVED', TRUE,  'Unverified placement claims and fabricated student reviews', 1, '2026-10-25 16:00:00+05:30');

INSERT INTO trainers (id, provider_id, name, email, phone, specialization, bio, avg_rating, is_active)
OVERRIDING SYSTEM VALUE VALUES
    (1, 2, 'Dr. Subhashis Ghosh', 'subhashis.ghosh@wbtechskills.gov.in', '+91-9830100001', 'Java & Distributed Microservices', '14 years teaching enterprise JVM architecture.',          4.5, TRUE),
    (2, 2, 'Rituparna Mukherjee', 'rituparna.m@wbtechskills.gov.in',     '+91-9830100002', 'PostgreSQL Internals & SQL',       'Former principal DBA specialising in indexing and MVCC.', 4.7, TRUE),
    (3, 3, 'Siddharth Menon',     'siddharth@cloudcraftacademy.in',      '+91-9845011122', 'AWS, Linux & Kubernetes SRE',      'Production site reliability engineer and CNCF speaker.',  4.7, TRUE),
    (4, 3, 'Meera Krishnan',      'meera@cloudcraftacademy.in',          '+91-9845011133', 'Applied Machine Learning & LLMs',  'Builds evaluation pipelines and RAG systems.',            4.5, TRUE);

INSERT INTO skills (id, name, category)
OVERRIDING SYSTEM VALUE VALUES
    (1,  'Java',                 'SOFTWARE_ENGINEERING'),
    (2,  'Spring Boot',          'SOFTWARE_ENGINEERING'),
    (3,  'PostgreSQL',           'DATABASE_ADMINISTRATION'),
    (4,  'Docker',               'DEVOPS_SYSADMIN'),
    (5,  'Linux Administration', 'DEVOPS_SYSADMIN'),
    (6,  'AWS',                  'CLOUD_COMPUTING'),
    (7,  'Kubernetes',           'DEVOPS_SYSADMIN'),
    (8,  'Python',               'AI_MACHINE_LEARNING'),
    (9,  'React',                'WEB_DEVELOPMENT'),
    (10, 'LLM Engineering',      'AI_MACHINE_LEARNING');

INSERT INTO courses (
    id, provider_id, name, description, category, duration_weeks, level,
    avg_rating, certificate_title, certificate_preview_s3_key, is_available
) OVERRIDING SYSTEM VALUE VALUES
    (1, 2, 'Java & Spring Boot Microservices',       'Production REST APIs, JPA persistence, and service security using Java 21 and Spring Boot.', 'SOFTWARE_ENGINEERING',    12, 'INTERMEDIATE', 4.5, 'Certificate in Java Microservices Engineering',   'certs/previews/course-1.png', TRUE),
    (2, 2, 'PostgreSQL Performance & Administration','Schema design, indexing strategies, query plans, and backup automation.',                  'DATABASE_ADMINISTRATION',  8, 'INTERMEDIATE', 5.0, 'Certificate in PostgreSQL Administration',        'certs/previews/course-2.png', TRUE),
    (3, 3, 'Cloud Infrastructure & DevOps Bootcamp', 'Linux hardening, containerisation with Docker, AWS architecture, and Kubernetes ops.',   'DEVOPS_SYSADMIN',         14, 'ADVANCED',     5.0, 'Certificate in Cloud & SRE Operations',           'certs/previews/course-3.png', TRUE),
    (4, 3, 'Applied AI & LLM Systems',               'Python backend integration, retrieval pipelines, and structured LLM output extraction.',   'AI_MACHINE_LEARNING',     10, 'ADVANCED',     4.5, 'Certificate in Applied LLM Engineering',          'certs/previews/course-4.png', TRUE),
    (5, 5, 'Legacy Full-Stack Crash Course',         'Discontinued introductory web curriculum.',                                                'WEB_DEVELOPMENT',          6, 'BEGINNER',     0.0, 'Certificate in Introductory Web Development',     NULL,                          FALSE);

INSERT INTO course_resources (id, course_id, title, resource_type, resource_url, thumbnail_url, display_order, is_active)
OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 'Spring Boot Architecture Walkthrough', 'VIDEO', 'https://www.youtube.com/watch?v=sbArch001', 'https://img.youtube.com/vi/sbArch001/hqdefault.jpg', 1, TRUE),
    (2, 1, 'Spring Data JPA Reference Notes',      'PDF',   's3://skilltrack-resources/courses/1/jpa-notes.pdf', NULL,                                        2, TRUE),
    (3, 2, 'EXPLAIN ANALYZE Deep Dive',            'VIDEO', 'https://www.youtube.com/watch?v=pgPlan002', 'https://img.youtube.com/vi/pgPlan002/hqdefault.jpg', 1, TRUE),
    (4, 3, 'Container Networking & Compose',       'VIDEO', 'https://www.youtube.com/watch?v=dkNet003',  'https://img.youtube.com/vi/dkNet003/hqdefault.jpg',  1, TRUE),
    (5, 3, 'AWS IAM Least-Privilege Checklist',    'DOCUMENT', 's3://skilltrack-resources/courses/3/iam-checklist.docx', NULL,                                2, TRUE),
    (6, 4, 'Structured Extraction with LLMs',      'VIDEO', 'https://www.youtube.com/watch?v=llmExt004', 'https://img.youtube.com/vi/llmExt004/hqdefault.jpg', 1, TRUE),
    (7, 4, 'Prompt Evaluation Benchmark Repo',     'LINK',  'https://github.com/cloudcraft-academy/llm-eval-lab', NULL,                                       2, TRUE);

INSERT INTO course_trainers (course_id, trainer_id, provider_id) VALUES
    (1, 1, 2),
    (1, 2, 2),
    (2, 2, 2),
    (3, 3, 3),
    (4, 4, 3),
    (4, 3, 3);

INSERT INTO course_skills (course_id, skill_id) VALUES
    (1, 1),
    (1, 2),
    (1, 3),
    (2, 3),
    (3, 4),
    (3, 5),
    (3, 6),
    (3, 7),
    (4, 8),
    (4, 10),
    (5, 9);

INSERT INTO course_enrolments (
    id, trainee_id, course_id, enrolled_at, completed_at,
    terminated_at, terminated_by, status, termination_reason, provider_remark
) OVERRIDING SYSTEM VALUE VALUES
    (1,  6,  1, '2026-01-10', '2026-04-05', NULL,                        NULL, 'COMPLETED',   NULL,                                                'Strong command of REST design and transactional boundaries'),
    (2,  6,  3, '2026-04-15', '2026-07-25', NULL,                        NULL, 'COMPLETED',   NULL,                                                'Delivered a tidy, reproducible container deployment pipeline'),
    (3,  7,  1, '2026-02-01', '2026-04-28', NULL,                        NULL, 'COMPLETED',   NULL,                                                'Consistent weekly submissions and thorough test coverage'),
    (4,  7,  4, '2026-09-10', NULL,         NULL,                        NULL, 'IN_PROGRESS', NULL,                                                'Active contributor during evaluation workshops'),
    (5,  8,  2, '2026-10-01', NULL,         NULL,                        NULL, 'IN_PROGRESS', NULL,                                                'Needs further practice reading nested loop query plans'),
    (6,  8,  3, '2026-06-01', NULL,         '2026-07-10 11:00:00+05:30', 8,    'DROPPED',     'Clashed with university semester examinations',     NULL),
    (7,  9,  1, '2026-05-05', NULL,         '2026-06-15 17:20:00+05:30', 2,    'KICKED',      'Submitted a plagiarised capstone repository',       'Issued one formal warning prior to dismissal'),
    (8,  10, 3, '2026-08-01', NULL,         '2026-09-12 15:10:00+05:30', 3,    'KICKED',      'Disruptive behaviour during live code reviews',     NULL),
    (9,  12, 2, '2026-03-01', '2026-04-26', NULL,                        NULL, 'COMPLETED',   NULL,                                                'Reinstated after medical leave and finished with distinction'),
    (10, 12, 4, '2026-06-10', '2026-08-22', NULL,                        NULL, 'COMPLETED',   NULL,                                                'Shipped a reliable structured-extraction capstone');

INSERT INTO course_enrolment_history (id, enrolment_id, old_status, new_status, reason, changed_by, changed_at)
OVERRIDING SYSTEM VALUE VALUES
    (1,  6, NULL,          'IN_PROGRESS', NULL,                                            8, '2026-06-01 10:00:00+05:30'),
    (2,  6, 'IN_PROGRESS', 'DROPPED',     'Clashed with university semester examinations', 8, '2026-07-10 11:00:00+05:30'),
    (3,  7, NULL,          'IN_PROGRESS', NULL,                                            9, '2026-05-05 09:30:00+05:30'),
    (4,  7, 'IN_PROGRESS', 'KICKED',      'Submitted a plagiarised capstone repository',   2, '2026-06-15 17:20:00+05:30'),
    (5,  8, NULL,          'IN_PROGRESS', NULL,                                            10,'2026-08-01 12:00:00+05:30'),
    (6,  8, 'IN_PROGRESS', 'KICKED',      'Disruptive behaviour during live code reviews', 3, '2026-09-12 15:10:00+05:30'),
    (7,  9, NULL,          'IN_PROGRESS', NULL,                                            12,'2026-03-01 09:00:00+05:30'),
    (8,  9, 'IN_PROGRESS', 'KICKED',      'Missed four consecutive lab checkpoints',       2, '2026-03-22 18:00:00+05:30'),
    (9,  9, 'KICKED',      'IN_PROGRESS', 'Medical documentation verified; reinstated',    1, '2026-03-25 11:15:00+05:30'),
    (10, 9, 'IN_PROGRESS', 'COMPLETED',   NULL,                                            2, '2026-04-26 16:45:00+05:30');

INSERT INTO course_reviews (id, trainee_id, course_id, rating, review)
OVERRIDING SYSTEM VALUE VALUES
    (1, 6,  1, 5, 'Well-paced coverage of Spring Boot; would benefit from a brief module on virtual threads.'),
    (2, 7,  1, 4, 'Clear explanations of JPA and REST security, though observability tooling felt rushed.'),
    (3, 12, 2, 5, 'Thorough treatment of B-tree versus GIN indexes and realistic query tuning labs.'),
    (4, 6,  3, 5, 'Practical AWS and Kubernetes labs; adding Terraform drift exercises would make it stronger.'),
    (5, 7,  4, 4, 'Solid retrieval pipelines, though latency budgeting and cost tracking deserve extra time.'),
    (6, 12, 4, 5, 'Current, well-structured curriculum with grounded production examples.');

INSERT INTO course_improvement_insights (course_id, summary, suggested_topics, based_on_review_count) VALUES
    (1, 'Learners praise core JPA and REST depth but request modern concurrency and observability labs.', '["Java 21 virtual threads", "OpenTelemetry tracing", "Spring Boot actuator dashboards"]'::jsonb, 2),
    (3, 'Strong hands-on infrastructure labs; students want deeper infrastructure-as-code drift handling.', '["Terraform state locking", "Drift detection in CI"]'::jsonb, 1),
    (4, 'High satisfaction with RAG patterns; add practical guidance on token budgets and p95 latency.',   '["LLM latency optimisation", "Prompt caching and cost guards"]'::jsonb, 2);

INSERT INTO trainee_skills (trainee_id, skill_id, proficiency_level, source) VALUES
    (6,  1,  'ADVANCED',     'COURSE_COMPLETION'),
    (6,  2,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (6,  3,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (6,  4,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (6,  5,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (6,  6,  'INTERMEDIATE', 'ASSESSMENT'),
    (6,  7,  'BEGINNER',     'COURSE_COMPLETION'),
    (7,  1,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (7,  2,  'INTERMEDIATE', 'COURSE_COMPLETION'),
    (7,  8,  'INTERMEDIATE', 'RESUME_ATS'),
    (8,  3,  'BEGINNER',     'SELF_REPORTED'),
    (8,  5,  'BEGINNER',     'SELF_REPORTED'),
    (9,  1,  'BEGINNER',     'SELF_REPORTED'),
    (12, 3,  'ADVANCED',     'COURSE_COMPLETION'),
    (12, 8,  'ADVANCED',     'COURSE_COMPLETION'),
    (12, 10, 'INTERMEDIATE', 'COURSE_COMPLETION'),
    (12, 4,  'INTERMEDIATE', 'RESUME_ATS');

INSERT INTO certifications (id, trainee_id, course_id, certificate_name, file_s3_key, issued_at)
OVERRIDING SYSTEM VALUE VALUES
    (1, 6,  1,    'Certificate in Java Microservices Engineering', 'certs/issued/trainee-6-course-1.pdf',  '2026-04-06'),
    (2, 6,  3,    'Certificate in Cloud & SRE Operations',         'certs/issued/trainee-6-course-3.pdf',  '2026-07-26'),
    (3, 6,  NULL, 'AWS Certified Cloud Practitioner',              'certs/issued/trainee-6-aws-ccp.pdf',   '2026-08-14'),
    (4, 7,  1,    'Certificate in Java Microservices Engineering', 'certs/issued/trainee-7-course-1.pdf',  '2026-04-29'),
    (5, 12, 2,    'Certificate in PostgreSQL Administration',      'certs/issued/trainee-12-course-2.pdf', '2026-04-27'),
    (6, 12, 4,    'Certificate in Applied LLM Engineering',        'certs/issued/trainee-12-course-4.pdf', '2026-08-23');

INSERT INTO trainee_projects (id, trainee_id, title, description, repo_url)
OVERRIDING SYSTEM VALUE VALUES
    (1, 6,  'LedgerFlow API',       'Double-entry accounting microservice built with Spring Boot and PostgreSQL.', 'https://github.com/arjun-sen/ledgerflow-api'),
    (2, 6,  'KubePulse Monitor',    'Lightweight Prometheus exporter for container health metrics.',               'https://github.com/arjun-sen/kubepulse-monitor'),
    (3, 7,  'ResumeTokeniser',      'Keyword extraction service pairing Python with structured JSON schemas.',     'https://github.com/priya-das/resume-tokeniser'),
    (4, 8,  'PgIndex Lab',          'Benchmark suite comparing B-tree and partial indexes on synthetic tables.',   'https://github.com/rohit-verma/pgindex-lab'),
    (5, 12, 'DocQuery RAG Engine',  'Document retrieval pipeline with PostgreSQL full-text and vector search.',    'https://github.com/kabir-nair/docquery-rag');

INSERT INTO trainee_resumes (id, file_s3_key, extracted_tokens) VALUES
    (6,  'resumes/trainee-6/arjun-sen-2026.pdf',   '{"skills": ["Java", "Spring Boot", "PostgreSQL", "Docker", "AWS"], "years_experience": 1}'::jsonb),
    (7,  'resumes/trainee-7/priya-das-2026.pdf',   '{"skills": ["Java", "Spring Boot", "Python"], "years_experience": 0}'::jsonb),
    (8,  'resumes/trainee-8/rohit-verma-2026.pdf', '{"skills": ["PostgreSQL", "Linux Administration"], "years_experience": 0}'::jsonb),
    (12, 'resumes/trainee-12/kabir-nair-2026.pdf', '{"skills": ["PostgreSQL", "Python", "LLM Engineering", "Docker"], "years_experience": 2}'::jsonb);

INSERT INTO roles (id, name, category, description, is_emerging)
OVERRIDING SYSTEM VALUE VALUES
    (1, 'Backend Java Engineer',         'SOFTWARE_ENGINEERING',    'Designs and maintains scalable server-side APIs and relational data models.', FALSE),
    (2, 'Cloud & SRE Engineer',          'DEVOPS_SYSADMIN',         'Operates resilient Linux, container, and cloud infrastructure.',              FALSE),
    (3, 'AI Systems Engineer',           'AI_MACHINE_LEARNING',     'Integrates foundation models, evaluation harnesses, and retrieval services.', TRUE),
    (4, 'Database Reliability Engineer', 'DATABASE_ADMINISTRATION', 'Automates schema governance, replication, and query performance.',            TRUE);

INSERT INTO role_required_skills (role_id, skill_id, required_proficiency) VALUES
    (1, 1,  'ADVANCED'),
    (1, 2,  'INTERMEDIATE'),
    (1, 3,  'INTERMEDIATE'),
    (1, 4,  'BEGINNER'),
    (2, 5,  'ADVANCED'),
    (2, 4,  'ADVANCED'),
    (2, 6,  'INTERMEDIATE'),
    (2, 7,  'INTERMEDIATE'),
    (3, 8,  'ADVANCED'),
    (3, 10, 'INTERMEDIATE'),
    (3, 4,  'BEGINNER'),
    (4, 3,  'ADVANCED'),
    (4, 5,  'INTERMEDIATE'),
    (4, 6,  'BEGINNER');

INSERT INTO trainee_target_roles (trainee_id, role_id, target_level) VALUES
    (6,  1, 'JUNIOR'),
    (6,  2, 'ENTRY_LEVEL'),
    (7,  1, 'INTERN'),
    (7,  3, 'ENTRY_LEVEL'),
    (8,  4, 'ENTRY_LEVEL'),
    (8,  2, 'ENTRY_LEVEL'),
    (9,  1, 'ENTRY_LEVEL'),
    (12, 3, 'MID_LEVEL'),
    (12, 4, 'JUNIOR');

INSERT INTO employers (id, name, industry)
OVERRIDING SYSTEM VALUE VALUES
    (1, 'TCS Digital',      'IT Services'),
    (2, 'Razorpay',         'FinTech'),
    (3, 'Zoho Corporation', 'Enterprise SaaS');

INSERT INTO employment_records (
    id, trainee_id, employer_id, role_id, employment_type, role_title,
    start_date, end_date, is_current, verification_status, training_relevance, job_source
) OVERRIDING SYSTEM VALUE VALUES
    (1, 6,  1,    1, 'INTERNSHIP',    'Backend Engineering Intern',         '2026-04-10', '2026-07-10', FALSE, 'VERIFIED',   'HIGH', 'TRAINING_PROVIDER'),
    (2, 6,  2,    1, 'FULL_TIME',     'Software Engineer - Backend',        '2026-08-01', NULL,         TRUE,  'VERIFIED',   'HIGH', 'JOB_PORTAL'),
    (3, 7,  3,    1, 'INTERNSHIP',    'Java Developer Intern',              '2026-06-01', NULL,         TRUE,  'UNVERIFIED', 'HIGH', 'TRAINING_PROVIDER'),
    (4, 12, NULL, 3, 'SELF_EMPLOYED', 'Independent AI & Database Consultant','2026-09-01', NULL,        TRUE,  'VERIFIED',   'HIGH', 'SELF_REPORTED');

INSERT INTO salary_history (id, employment_id, salary_amount, salary_period, recorded_at)
OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 25000.00,  'MONTHLY', '2026-04-10'),
    (2, 2, 950000.00, 'YEARLY',  '2026-08-01'),
    (3, 3, 30000.00,  'MONTHLY', '2026-06-01'),
    (4, 4, 75000.00,  'MONTHLY', '2026-09-15');

INSERT INTO follow_up_batches (id, started_at, ended_at, triggered_by)
OVERRIDING SYSTEM VALUE VALUES
    (1, '2026-09-01 09:00:00+05:30', '2026-09-01 09:04:12+05:30', 1),
    (2, '2026-10-01 09:00:00+05:30', '2026-10-01 09:03:48+05:30', 1),
    (3, '2026-11-01 09:00:00+05:30', '2026-11-01 09:04:05+05:30', 1);

INSERT INTO follow_ups (id, batch_id, trainee_id, scheduled_at, completed_at, employment_status, response_status)
OVERRIDING SYSTEM VALUE VALUES
    (1, 1, 11, '2026-09-01', NULL,         NULL,            'NO_RESPONSE'),
    (2, 2, 6,  '2026-10-01', '2026-10-02', 'FULL_TIME',     'COMPLETED'),
    (3, 2, 7,  '2026-10-01', '2026-10-03', 'INTERNSHIP',    'COMPLETED'),
    (4, 2, 11, '2026-10-01', NULL,         NULL,            'NO_RESPONSE'),
    (5, 3, 6,  '2026-11-01', '2026-11-02', 'FULL_TIME',     'COMPLETED'),
    (6, 3, 7,  '2026-11-01', NULL,         NULL,            'NO_RESPONSE'),
    (7, 3, 8,  '2026-11-01', NULL,         NULL,            'PENDING'),
    (8, 3, 11, '2026-11-01', NULL,         NULL,            'NO_RESPONSE'),
    (9, 3, 12, '2026-11-01', '2026-11-03', 'SELF_EMPLOYED', 'COMPLETED');

INSERT INTO follow_up_logs (id, follow_up_id, email_sent_at, email_status, email_subject, response_received_at, failure_reason)
OVERRIDING SYSTEM VALUE VALUES
    (1,  1, '2026-09-01 09:01:00+05:30', 'SENT',   'Skill-Track Monthly Check-in (Sep 2026)', NULL,                        NULL),
    (2,  2, '2026-10-01 09:00:45+05:30', 'SENT',   'Skill-Track Monthly Check-in (Oct 2026)', '2026-10-02 10:15:00+05:30', NULL),
    (3,  3, '2026-10-01 09:01:10+05:30', 'SENT',   'Skill-Track Monthly Check-in (Oct 2026)', '2026-10-03 18:40:00+05:30', NULL),
    (4,  4, '2026-10-01 09:01:30+05:30', 'SENT',   'Skill-Track Monthly Check-in (Oct 2026)', NULL,                        NULL),
    (5,  5, '2026-11-01 09:00:30+05:30', 'SENT',   'Skill-Track Monthly Check-in (Nov 2026)', '2026-11-02 11:05:00+05:30', NULL),
    (6,  6, '2026-11-01 09:00:50+05:30', 'SENT',   'Skill-Track Monthly Check-in (Nov 2026)', NULL,                        NULL),
    (7,  7, '2026-11-01 09:01:15+05:30', 'FAILED', 'Skill-Track Monthly Check-in (Nov 2026)', NULL,                        'SMTP 421 temporary rate limit exceeded'),
    (8,  7, '2026-11-01 09:16:15+05:30', 'SENT',   'Skill-Track Monthly Check-in (Nov 2026)', NULL,                        NULL),
    (9,  8, '2026-11-01 09:01:40+05:30', 'SENT',   'Skill-Track Monthly Check-in (Nov 2026)', NULL,                        NULL),
    (10, 9, '2026-11-01 09:02:05+05:30', 'SENT',   'Skill-Track Monthly Check-in (Nov 2026)', '2026-11-03 14:22:00+05:30', NULL);

INSERT INTO platform_moderation_history (id, target_user_id, action, reason, acted_by, acted_at)
OVERRIDING SYSTEM VALUE VALUES
    (1, 2,  'APPROVED',     NULL,                                                                      1,    '2026-01-05 11:00:00+05:30'),
    (2, 3,  'APPROVED',     NULL,                                                                      1,    '2026-01-06 12:30:00+05:30'),
    (3, 5,  'APPROVED',     NULL,                                                                      1,    '2026-02-10 10:15:00+05:30'),
    (4, 5,  'KICKED',       'Unverified placement claims and fabricated student reviews',              1,    '2026-10-25 16:00:00+05:30'),
    (5, 10, 'KICKED',       'Repeated code of conduct breaches across platform channels',              1,    '2026-10-18 14:30:00+05:30'),
    (6, 11, 'AUTO_REMOVED', 'No response to three consecutive follow-up emails; personal data erased', NULL, '2026-11-12 09:00:00+05:30');

SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users));
SELECT setval(pg_get_serial_sequence('trainers', 'id'), (SELECT MAX(id) FROM trainers));
SELECT setval(pg_get_serial_sequence('skills', 'id'), (SELECT MAX(id) FROM skills));
SELECT setval(pg_get_serial_sequence('courses', 'id'), (SELECT MAX(id) FROM courses));
SELECT setval(pg_get_serial_sequence('course_resources', 'id'), (SELECT MAX(id) FROM course_resources));
SELECT setval(pg_get_serial_sequence('course_enrolments', 'id'), (SELECT MAX(id) FROM course_enrolments));
SELECT setval(pg_get_serial_sequence('course_enrolment_history', 'id'), (SELECT MAX(id) FROM course_enrolment_history));
SELECT setval(pg_get_serial_sequence('course_reviews', 'id'), (SELECT MAX(id) FROM course_reviews));
SELECT setval(pg_get_serial_sequence('certifications', 'id'), (SELECT MAX(id) FROM certifications));
SELECT setval(pg_get_serial_sequence('trainee_projects', 'id'), (SELECT MAX(id) FROM trainee_projects));
SELECT setval(pg_get_serial_sequence('roles', 'id'), (SELECT MAX(id) FROM roles));
SELECT setval(pg_get_serial_sequence('employers', 'id'), (SELECT MAX(id) FROM employers));
SELECT setval(pg_get_serial_sequence('employment_records', 'id'), (SELECT MAX(id) FROM employment_records));
SELECT setval(pg_get_serial_sequence('salary_history', 'id'), (SELECT MAX(id) FROM salary_history));
SELECT setval(pg_get_serial_sequence('follow_up_batches', 'id'), (SELECT MAX(id) FROM follow_up_batches));
SELECT setval(pg_get_serial_sequence('follow_ups', 'id'), (SELECT MAX(id) FROM follow_ups));
SELECT setval(pg_get_serial_sequence('follow_up_logs', 'id'), (SELECT MAX(id) FROM follow_up_logs));
SELECT setval(pg_get_serial_sequence('platform_moderation_history', 'id'), (SELECT MAX(id) FROM platform_moderation_history));

COMMIT;