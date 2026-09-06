-- ============================================================
-- SKILLPULSE - DUMMY DATA
-- ============================================================

-- ============================================================
-- NON-PLACEMENT REASONS
-- ============================================================

INSERT INTO non_placement_reasons (reason)
VALUES
    ('Lack of required skills'),
    ('No suitable jobs nearby'),
    ('Salary too low'),
    ('Relocation required'),
    ('Family responsibilities'),
    ('Pursuing higher education'),
    ('Still searching'),
    ('Personal reasons');


-- ============================================================
-- TRAINING PROVIDERS
-- ============================================================

INSERT INTO training_providers (name, provider_type)
VALUES
    ('Maharashtra Digital Skills Centre', 'Government'),
    ('TechPath Training Institute', 'Private'),
    ('SkillBridge Academy', 'Private'),
    ('MahaSkill Development Centre', 'Government'),
    ('FutureTech Academy', 'Private'),
    ('Digital Maharashtra Institute', 'Government'),
    ('NextGen Skills Hub', 'Private'),
    ('CareerReady Institute', 'Private'),
    ('Maharashtra IT Skills Centre', 'Government'),
    ('Udyam Skill Development Centre', 'Government');


-- ============================================================
-- COURSES
-- ============================================================

INSERT INTO courses
    (provider_id, name, category, duration_weeks, level)
VALUES
    (1,  'Full Stack Web Development',    'IT',           24, 'Intermediate'),
    (1,  'Java Programming',               'IT',           16, 'Beginner'),
    (2,  'React Web Development',          'IT',           16, 'Intermediate'),
    (2,  'Python Development',             'IT',           20, 'Intermediate'),
    (3,  'Data Analytics',                 'Data',         20, 'Intermediate'),
    (3,  'Cloud Computing Fundamentals',   'Cloud',        16, 'Intermediate'),
    (4,  'Digital Marketing',              'Marketing',    12, 'Beginner'),
    (4,  'Graphic Design',                 'Design',       16, 'Beginner'),
    (5,  'DevOps Engineering',             'IT',           24, 'Advanced'),
    (5,  'Cybersecurity Fundamentals',     'Security',     20, 'Intermediate'),
    (6,  'AWS Cloud Practitioner',         'Cloud',        12, 'Beginner'),
    (6,  'Database Administration',        'IT',           16, 'Intermediate'),
    (7,  'Android Development',            'Mobile',       20, 'Intermediate'),
    (8,  'UI/UX Design',                   'Design',       16, 'Beginner'),
    (9,  'Machine Learning Fundamentals',  'AI',            24, 'Advanced'),
    (10, 'Entrepreneurship & Small Business', 'Business',  12, 'Beginner');


-- ============================================================
-- SKILLS
-- ============================================================

INSERT INTO skills (name, category)
VALUES
    ('Java',               'Programming'),
    ('Python',             'Programming'),
    ('JavaScript',         'Programming'),
    ('TypeScript',         'Programming'),
    ('React',               'Frontend'),
    ('HTML',                'Frontend'),
    ('CSS',                 'Frontend'),
    ('Spring Boot',         'Backend'),
    ('Node.js',             'Backend'),
    ('REST API',            'Backend'),
    ('SQL',                 'Database'),
    ('PostgreSQL',          'Database'),
    ('MongoDB',             'Database'),
    ('Git',                 'Tools'),
    ('GitHub',              'Tools'),
    ('Docker',              'DevOps'),
    ('Kubernetes',          'DevOps'),
    ('AWS',                 'Cloud'),
    ('Azure',               'Cloud'),
    ('Linux',               'Systems'),
    ('CI/CD',               'DevOps'),
    ('Terraform',           'DevOps'),
    ('Power BI',            'Data'),
    ('Excel',               'Data'),
    ('Data Analysis',       'Data'),
    ('Machine Learning',    'AI'),
    ('Figma',               'Design'),
    ('UI Design',           'Design'),
    ('Digital Marketing',   'Marketing'),
    ('Cybersecurity',       'Security'),
    ('C++',                 'Programming'),
    ('Go',                  'Programming'),
    ('Rust',                'Programming'),
    ('Vue.js',               'Frontend'),
    ('Angular',              'Frontend'),
    ('Tailwind CSS',         'Frontend'),
    ('Django',               'Backend'),
    ('Flask',                'Backend'),
    ('GraphQL',              'Backend'),
    ('Flutter',              'Mobile'),
    ('Kotlin',               'Mobile'),
    ('Swift',                'Mobile'),
    ('Google Cloud Platform','Cloud'),
    ('Ansible',              'DevOps'),
    ('Jenkins',              'DevOps'),
    ('Networking',           'Systems'),
    ('Bash Scripting',       'Systems'),
    ('Tableau',              'Data'),
    ('R',                    'Data'),
    ('Deep Learning',        'AI'),
    ('Natural Language Processing', 'AI'),
    ('Penetration Testing',  'Security'),
    ('Selenium',             'Testing'),
    ('Jest',                 'Testing'),
    ('Communication',        'Soft Skills'),
    ('Problem Solving',      'Soft Skills');


-- ============================================================
-- TRAINEES
-- ============================================================

INSERT INTO trainees (
    name,
    date_of_birth,
    last_educational_qualification,
    phone_primary,
    phone_secondary,
    consent_status
)
SELECT
    (ARRAY[
        'Aarav','Priya','Rahul','Sneha','Aditya','Ananya','Rohan','Neha',
        'Vivek','Pooja','Siddharth','Isha','Kunal','Riya','Akash','Meera',
        'Nikhil','Kavya','Yash','Tanvi','Arjun','Diya','Kabir','Anika',
        'Vihaan','Saanvi','Reyansh','Myra','Ira','Vivaan','Anaya','Advait',
        'Aadhya','Dhruv','Kiara','Ishaan','Navya','Yuvraj','Prisha','Rudra',
        'Anvi','Krish','Zara','Aryan','Tara','Veer','Nisha','Arnav',
        'Ridhima','Sanjay'
    ])[1 + ((n - 1) % 50)]
    || ' ' ||
    (ARRAY[
        'Sharma','Patil','Deshmukh','Kulkarni','Joshi','More','Pawar',
        'Jadhav','Shinde','Chavan','Bhosale','Gaikwad','Mane','Kadam',
        'Wagh','Sawant','Nair','Reddy','Iyer','Menon','Gupta','Verma',
        'Singh','Khan','Chatterjee','Banerjee','Mukherjee','Das','Bose',
        'Agarwal'
    ])[1 + (((n - 1) / 50) % 30)],

    DATE '1995-01-01' + ((n * 37) % 6000),

    CASE (n % 5)
        WHEN 0 THEN '10th'
        WHEN 1 THEN '12th'
        WHEN 2 THEN 'Diploma'
        WHEN 3 THEN 'Bachelor''s'
        ELSE 'Master''s'
    END,

    '98' || LPAD((1000000 + n)::TEXT, 8, '0'),

    CASE
        WHEN n % 4 = 0
        THEN '97' || LPAD((2000000 + n)::TEXT, 8, '0')
        ELSE NULL
    END,

    CASE
        WHEN n % 25 = 0 THEN FALSE
        ELSE TRUE
    END

FROM generate_series(1, 1500) AS n;


-- ============================================================
-- TRAINEE ADDRESSES
-- ============================================================

INSERT INTO trainee_addresses (
    trainee_id,
    address_line,
    city,
    district,
    state,
    pincode
)
SELECT
    t.id,

    (ARRAY[
        'MG Road',
        'Shivaji Nagar',
        'Station Road',
        'Market Road',
        'Gandhi Chowk',
        'College Road',
        'Nehru Nagar',
        'Main Road'
    ])[1 + ((t.id - 1) % 8)] || ', House ' || t.id,

    (ARRAY[
        'Mumbai',
        'Pune',
        'Nagpur',
        'Nashik',
        'Thane',
        'Aurangabad',
        'Kolhapur',
        'Navi Mumbai'
    ])[1 + ((t.id - 1) % 8)],

    (ARRAY[
        'Mumbai',
        'Pune',
        'Nagpur',
        'Nashik',
        'Thane',
        'Aurangabad',
        'Kolhapur',
        'Navi Mumbai'
    ])[1 + ((t.id - 1) % 8)],

    'Maharashtra',

    (400000 + ((t.id * 17) % 50000))::TEXT

FROM trainees t;


-- ============================================================
-- TRAINEE COURSES
-- ============================================================

INSERT INTO trainee_courses (
    trainee_id,
    course_id,
    enrolled_at,
    completed_at,
    status
)
SELECT
    t.id,

    1 + ((t.id - 1) % 16),

    DATE '2025-01-01' + (((t.id * 3) % 300)::INTEGER),

    CASE
        WHEN t.id % 10 < 8
        THEN DATE '2025-01-01'
             + (((t.id * 3) % 300)::INTEGER)
             + 120
        ELSE NULL
    END,

    CASE
        WHEN t.id % 10 < 8 THEN 'completed'
        WHEN t.id % 10 = 8 THEN 'dropped'
        ELSE 'in_progress'
    END

FROM trainees t;


-- ============================================================
-- CERTIFICATIONS
-- ============================================================

INSERT INTO certifications (
    trainee_id,
    course_id,
    certificate_name,
    issued_at,
    score
)
SELECT
    tc.trainee_id,
    tc.course_id,
    c.name || ' Certification',
    tc.completed_at,
    ROUND((60 + ((tc.trainee_id * 7) % 41))::NUMERIC, 2)

FROM trainee_courses tc

JOIN courses c
    ON c.id = tc.course_id

WHERE tc.status = 'completed';


-- ============================================================
-- TRAINEE SKILLS
-- ============================================================

INSERT INTO trainee_skills (
    trainee_id,
    skill_id,
    proficiency_level,
    source
)
SELECT
    t.id,
    s.id,

    CASE ((t.id + s.id) % 3)
        WHEN 0 THEN 'Beginner'
        WHEN 1 THEN 'Intermediate'
        ELSE 'Advanced'
    END,

    CASE
        WHEN t.id % 2 = 0 THEN 'training'
        ELSE 'self-reported'
    END

FROM trainees t

CROSS JOIN skills s

WHERE ((t.id + s.id) % 11) < 2;


-- ============================================================
-- EMPLOYERS
-- ============================================================

INSERT INTO employers (
    name,
    industry,
    district,
    verification_status,
    verified_at
)
SELECT
    'Employer ' || n,

    (ARRAY[
        'IT Services',
        'Finance',
        'Healthcare',
        'Retail',
        'Manufacturing',
        'E-commerce',
        'Telecommunications'
    ])[1 + ((n - 1) % 7)],

    (ARRAY[
        'Mumbai',
        'Pune',
        'Nagpur',
        'Nashik',
        'Thane',
        'Aurangabad',
        'Kolhapur'
    ])[1 + ((n - 1) % 7)],

    CASE
        WHEN n % 5 = 0 THEN 'unverified'
        ELSE 'verified'
    END,

    CASE
        WHEN n % 5 = 0 THEN NULL
        ELSE NOW() - ((n % 300) || ' days')::INTERVAL
    END

FROM generate_series(1, 400) AS n;


-- ============================================================
-- EMPLOYMENT RECORDS
-- ============================================================

INSERT INTO employment_records (
    trainee_id,
    employer_id,
    employment_type,
    role,
    start_date,
    end_date,
    status,
    verification_status,
    training_relevance,
    job_source
)
SELECT
    t.id,

    CASE
        WHEN t.id % 20 >= 14
        THEN NULL
        ELSE 1 + ((t.id - 1) % 400)
    END,

    CASE
        WHEN t.id % 20 < 14 THEN 'employment'
        WHEN t.id % 20 < 17 THEN 'self-employment'
        WHEN t.id % 20 < 19 THEN 'apprenticeship'
        ELSE 'unemployed'
    END,

    CASE (t.id % 6)
        WHEN 0 THEN 'Data Analyst'
        WHEN 1 THEN 'Software Developer'
        WHEN 2 THEN 'Web Developer'
        WHEN 3 THEN 'Cloud Support Engineer'
        WHEN 4 THEN 'Digital Marketing Executive'
        ELSE 'UI/UX Designer'
    END,

    CASE
        WHEN t.id % 20 >= 19
        THEN NULL
        ELSE DATE '2025-06-01' + ((t.id % 250)::INTEGER)
    END,

    CASE
        WHEN t.id % 30 BETWEEN 0 AND 3
             AND t.id % 20 < 14
        THEN DATE '2026-01-01' + (((t.id * 2) % 180)::INTEGER)
        ELSE NULL
    END,

    CASE
        WHEN t.id % 20 >= 19 THEN 'inactive'
        WHEN t.id % 30 BETWEEN 0 AND 3
             AND t.id % 20 < 14 THEN 'inactive'
        ELSE 'active'
    END,

    CASE
        WHEN t.id % 5 = 0 THEN 'unverified'
        ELSE 'verified'
    END,

    CASE
        WHEN t.id % 10 < 6 THEN 'high'
        WHEN t.id % 10 < 8 THEN 'medium'
        WHEN t.id % 10 = 8 THEN 'low'
        ELSE 'unrelated'
    END,

    CASE
        WHEN t.id % 4 = 0 THEN 'self_reported'
        WHEN t.id % 4 = 1 THEN 'training_provider'
        WHEN t.id % 4 = 2 THEN 'employer'
        ELSE 'job_portal'
    END

FROM trainees t

WHERE t.id <= 1350;


-- ============================================================
-- SALARY HISTORY
-- ============================================================

-- Starting salary
INSERT INTO salary_history (
    employment_id,
    salary_amount,
    salary_period,
    recorded_at
)
SELECT
    er.id,

    14000 + ((er.trainee_id * 137) % 16000),

    'monthly',

    er.start_date

FROM employment_records er

WHERE er.employment_type = 'employment'
  AND er.start_date IS NOT NULL;


-- Six-month salary
INSERT INTO salary_history (
    employment_id,
    salary_amount,
    salary_period,
    recorded_at
)
SELECT
    er.id,

    ROUND(
        (
            14000 + ((er.trainee_id * 137) % 16000)
        ) *
        (
            1 + ((er.trainee_id % 30) / 100.0)
        ),
        2
    ),

    'monthly',

    er.start_date + 180

FROM employment_records er

WHERE er.employment_type = 'employment'
  AND er.start_date IS NOT NULL;


-- ============================================================
-- FOLLOW-UPS
-- ============================================================

-- First follow-up
INSERT INTO follow_ups (
    trainee_id,
    scheduled_at,
    completed_at,
    channel,
    employment_status,
    response_status
)
SELECT
    t.id,

    DATE '2026-01-01' + (((t.id * 3) % 120)::INTEGER),

    CASE
        WHEN t.id % 8 <> 0
        THEN DATE '2026-01-03' + (((t.id * 3) % 120)::INTEGER)
        ELSE NULL
    END,

    CASE (t.id % 3)
        WHEN 0 THEN 'SMS'
        WHEN 1 THEN 'Email'
        ELSE 'App'
    END,

    CASE
        WHEN t.id % 20 < 14 THEN 'employed'
        WHEN t.id % 20 < 17 THEN 'self-employed'
        WHEN t.id % 20 < 19 THEN 'apprenticeship'
        ELSE 'unemployed'
    END,

    CASE
        WHEN t.id % 8 = 0 THEN 'no_response'
        ELSE 'completed'
    END

FROM trainees t;


-- Second follow-up
INSERT INTO follow_ups (
    trainee_id,
    scheduled_at,
    completed_at,
    channel,
    employment_status,
    response_status
)
SELECT
    t.id,

    DATE '2026-06-01' + (((t.id * 2) % 60)::INTEGER),

    CASE
        WHEN t.id % 10 <> 0
        THEN DATE '2026-06-03' + (((t.id * 2) % 60)::INTEGER)
        ELSE NULL
    END,

    CASE (t.id % 3)
        WHEN 0 THEN 'SMS'
        WHEN 1 THEN 'Email'
        ELSE 'App'
    END,

    CASE
        WHEN t.id % 20 < 14 THEN 'employed'
        WHEN t.id % 20 < 17 THEN 'self-employed'
        WHEN t.id % 20 < 19 THEN 'apprenticeship'
        ELSE 'unemployed'
    END,

    CASE
        WHEN t.id % 10 = 0 THEN 'no_response'
        ELSE 'completed'
    END

FROM trainees t;


-- ============================================================
-- NON-PLACEMENT REPORTS
-- ============================================================

INSERT INTO trainee_non_placement (
    trainee_id,
    reason_id,
    reported_at
)
SELECT
    t.id,

    1 + ((t.id - 1351) % 8),

    CURRENT_DATE - ((t.id % 180)::INTEGER)

FROM trainees t

WHERE t.id > 1350;
