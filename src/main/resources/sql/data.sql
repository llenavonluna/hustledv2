-- src/main/resources/data.sql
INSERT INTO hustleddb.users (username, password, email, phone, role)
VALUES
  ('admin', '$2a$10$QJjJ9eKqQJk8zR8y6pZC3OfD9oT0Q3kK8iWZyP9SxWZq5OqQH4/2a', 'admin@hustleed.com', '09123456789', 'ADMIN'),
  ('nhyll', '$2a$10$QJjJ9eKqQJk8zR8y6pZC3OfD9oT0Q3kK8iWZyP9SxWZq5OqQH4/2a', 'nhyll@hustleed.com', '09987654321', 'USER');

-- The bcrypt above is "password" for demo (10 rounds)

INSERT INTO hustleddb.jobs (title, company, location, description, posted_by)
VALUES
  ('Java Developer', 'TechWorks', 'Quezon City', 'Build backend services using Spring Boot.', 1),
  ('Frontend Engineer', 'CreativeSoft', 'Makati', 'React + TypeScript UI development.', 1),
  ('QA Tester', 'QualityPro', 'Taguig', 'Manual and automated testing.', 2);
