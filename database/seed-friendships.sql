-- Seed friendships (enforcing user_id_1 < user_id_2 check constraint)
INSERT INTO friendships (user_id_1, user_id_2)
VALUES
(1, 2), -- jdizzle & alice
(1, 5), -- jdizzle & david
(3, 4), -- bob & charlie
(6, 8)  -- eve & grace
ON CONFLICT (user_id_1, user_id_2) DO NOTHING;
