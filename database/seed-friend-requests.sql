-- Seed friend requests (Assuming auto-generated user IDs are 1 to 8 respectively)
INSERT INTO friend_requests (sender_id, receiver_id, status)
VALUES 
(2, 3, 'pending'),   -- alice -> bob
(4, 2, 'pending'),   -- charlie -> alice
(1, 5, 'accepted'),  -- jdizzle -> david
(6, 8, 'accepted'),  -- eve -> grace
(3, 5, 'declined'),  -- bob -> david
(7, 6, 'cancelled'), -- frank -> eve
(8, 4, 'pending'),   -- grace -> charlie
(1, 3, 'pending')    -- jdizzle -> bob
ON CONFLICT (sender_id, receiver_id) DO NOTHING;