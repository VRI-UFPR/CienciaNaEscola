CREATE TABLE form (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    times BOOLEAN
);

CREATE TABLE input (
    id SERIAL PRIMARY KEY,
    id_form INTEGER,
    placement INTEGER,
    input_type TEXT,
    question TEXT,
    enabled BOOLEAN,
    description TEXT
);

CREATE TABLE input_validation (
    id SERIAL PRIMARY KEY,
    id_input INTEGER,
    validation_type TEXT
);

CREATE TABLE input_validation_argument (
    id SERIAL PRIMARY KEY,
    id_input_validation INTEGER,
    placement INTEGER,
    argument TEXT
);

CREATE TABLE form_answer (
    id SERIAL PRIMARY KEY,
    id_form INTEGER,
    answered_at TIMESTAMP
);

CREATE TABLE input_answer (
    id SERIAL PRIMARY KEY,
    id_form_answer INTEGER,
    id_input INTEGER,
    id_sub_form INTEGER,
    value TEXT,
    placement INTEGER
);

CREATE TABLE form_update (
    id SERIAL PRIMARY KEY,
    id_form INTEGER,
    update_date TIMESTAMP
);

CREATE TABLE input_update (
    id SERIAL PRIMARY KEY,
    id_form_update INTEGER,
    id_input INTEGER,
    input_operation_id INTEGER,
    value TEXT
);

CREATE TABLE input_operation (
    id INTEGER,
    name TEXT
);

CREATE TABLE input_sugestion (
    id SERIAL PRIMARY KEY,
    id_input INTEGER,
    value TEXT,
    placement INTEGER
);

CREATE TABLE form_user (
    id SERIAL PRIMARY KEY,
    email TEXT UNIQUE,
    name TEXT UNIQUE,
    hash TEXT UNIQUE,
    enabled BOOLEAN
);

CREATE TABLE sub_form (
    id SERIAL PRIMARY KEY,
    id_input INTEGER,
    id_content_form INTEGER
);

CREATE TABLE form_owner (
    id SERIAL PRIMARY KEY,
    id_user INTEGER,
    id_form INTEGER
);

