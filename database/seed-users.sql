INSERT INTO users (username, display_name, password_hash)
VALUES 
('jdizzle', 'joseGOAT', '$2a$10$X87K.0a07E4/E8.o0tPee.ZgXF7p/L3bJ6s.X7o1c8Nq9jP5E32bC'),
('alice', 'Alikeable', '$2a$10$X87K.0a07E4/E8.o0tPee.ZgXF7p/L3bJ6s.X7o1c8Nq9jP5E32bC')
ON CONFLICT (username) DO NOTHING;
