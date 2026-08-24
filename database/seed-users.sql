INSERT INTO users (username, display_name, password_hash)
VALUES 
('jdizzle', 'joseGOAT', 'Password123!'),
('alice', 'Alikeable', 'Password123!'),
('bob', 'Builder', 'Password123!'),
('charlie', 'Chocolate', 'Password123!'),
('david', 'GoliathSlayer', 'Password123!'),
('eve', 'GardenOfEve', 'Password123!'),
('frank', 'Sinatra', 'Password123!'),
('grace', 'Hopper', 'Password123!')
ON CONFLICT (username) DO NOTHING;
