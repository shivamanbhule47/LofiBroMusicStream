/*
# Seed Lofi Bros Database with Initial Data

1. Mood Tags
- Study, Sleep, Focus, Relax with active status and sort order

2. Categories
- 20 browse categories for search page with gradient colors

3. Playlists
- Top lofi mixes, chill beats, and focus flow playlists
- Including live playlist indicator

4. Tracks
- Sample tracks for the Late Night Coding playlist

5. Important Notes
- All data is intentionally public/shared for the music streaming app
- Images use Pexels stock photos as specified
- Play counts formatted as text for display
*/

-- Insert mood tags
INSERT INTO mood_tags (label, is_active, sort_order) VALUES
('Study', true, 1),
('Sleep', false, 2),
('Focus', false, 3),
('Relax', false, 4)
ON CONFLICT (label) DO NOTHING;

-- Insert categories
INSERT INTO categories (title, gradient, sort_order) VALUES
('Podcasts', 'from-purple-600 to-purple-900', 1),
('Live Events', 'from-orange-500 to-rose-500', 2),
('Made For You', 'from-blue-600 to-blue-900', 3),
('New Releases', 'from-green-500 to-green-700', 4),
('Pop', 'from-pink-500 to-pink-700', 5),
('Hip-Hop', 'from-amber-600 to-amber-800', 6),
('Rock', 'from-red-600 to-red-800', 7),
('Latin', 'from-orange-400 to-orange-600', 8),
('Mood', 'from-teal-500 to-teal-700', 9),
('Indie', 'from-slate-500 to-slate-700', 10),
('Workout', 'from-lime-500 to-lime-700', 11),
('Discover', 'from-cyan-500 to-cyan-700', 12),
('Country', 'from-yellow-600 to-amber-600', 13),
('R&B', 'from-violet-600 to-violet-800', 14),
('K-Pop', 'from-fuchsia-500 to-fuchsia-700', 15),
('Chill', 'from-sky-500 to-sky-700', 16),
('Sleep', 'from-indigo-800 to-purple-900', 17),
('Party', 'from-rose-500 to-pink-600', 18),
('At Home', 'from-emerald-500 to-emerald-700', 19),
('Decades', 'from-neutral-600 to-neutral-800', 20)
ON CONFLICT (title) DO NOTHING;

-- Insert playlists
INSERT INTO playlists (title, artist, description, cover_url, plays, tracks_count, is_live, mood_tag_id) VALUES
-- Top Lofi Mixes
('Late Night Coding', 'ChillHop Records', 'Perfect beats for your coding sessions', 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?w=300', '2.4M', 8, false, (SELECT id FROM mood_tags WHERE label = 'Study' LIMIT 1)),
('Rainy Day Beats', 'Ambient Sounds', 'Cozy sounds for rainy days', 'https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg?w=300', '1.8M', 12, false, (SELECT id FROM mood_tags WHERE label = 'Relax' LIMIT 1)),
('Study Session', 'Focus Flow', 'Stay focused and productive', 'https://images.pexels.com/photos/374746/pexels-photo-374746.jpeg?w=300', '3.2M', 24, false, (SELECT id FROM mood_tags WHERE label = 'Focus' LIMIT 1)),
('Midurnal Dreams', 'Lofi Collective', 'Dreamy lofi for late nights', 'https://images.pexels.com/photos/1478685/pexels-photo-1478685.jpeg?w=300', '950K', 18, false, (SELECT id FROM mood_tags WHERE label = 'Sleep' LIMIT 1)),
('Coffee Shop Jazz', 'Smooth Vibes', 'Jazz-infused lofi beats', 'https://images.pexels.com/photos/140822/pexels-photo-140822.jpeg?w=300', '1.1M', 15, false, (SELECT id FROM mood_tags WHERE label = 'Relax' LIMIT 1)),

-- Chill Beats (with live indicator)
('Sleepy Sloth', 'Lofi Bros', 'Ultra chill beats for relaxation', 'https://images.pexels.com/photos/176092/pexels-photo-176092.jpeg?w=300', NULL, 48, true, (SELECT id FROM mood_tags WHERE label = 'Sleep' LIMIT 1)),
('Moonlit Sessions', 'Night Owl', 'Midurnal atmosphere vibes', 'https://images.pexels.com/photos/1171543/pexels-photo-1171543.jpeg?w=300', NULL, 32, false, NULL),
('Tokyo Drift', 'Urban Beats', 'Japanese city pop inspired', 'https://images.pexels.com/photos/2161467/pexels-photo-2161467.jpeg?w=300', NULL, 56, false, NULL),
('Vinyl Crackle', 'Retro Waves', 'Warm vinyl sound textures', 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?w=300', NULL, 24, false, NULL),

-- Focus Flow
('Deep Work', 'Concentration Station', 'Maximum focus session', 'https://images.pexels.com/photos/1595391/pexels-photo-1595391.jpeg?w=300', NULL, 72, false, (SELECT id FROM mood_tags WHERE label = 'Focus' LIMIT 1)),
('Flow State', 'Mindful Audio', 'Enter the zone', 'https://images.pexels.com/photos/544556/pexels-photo-544556.jpeg?w=300', NULL, 45, false, (SELECT id FROM mood_tags WHERE label = 'Focus' LIMIT 1)),
('Brain Food', 'Neural Beats', 'Cognitive enhancement', 'https://images.pexels.com/photos/207452/pexels-photo-207452.jpeg?w=300', NULL, 38, false, (SELECT id FROM mood_tags WHERE label = 'Study' LIMIT 1)),
('Ambient Focus', 'Silent Studio', 'Minimal distractions', 'https://images.pexels.com/photos/694587/pexels-photo-694587.jpeg?w=300', NULL, 64, false, (SELECT id FROM mood_tags WHERE label = 'Study' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Insert tracks for the first playlist (Late Night Coding)
INSERT INTO tracks (title, artist, album, duration, plays, playlist_id, sort_order) VALUES
('Moonlight Drive', 'Lofi Bros', 'Late Night Coding', '3:24', '1.2M', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 1),
('Rain on Window', 'Ambient Sounds', 'Late Night Coding', '2:58', '890K', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 2),
('Late Night Brew', 'Lofi Bros', 'Late Night Coding', '4:12', '1.5M', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 3),
('Neon District', 'Urban Beats', 'Late Night Coding', '3:45', '670K', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 4),
('Sleepy Sloth', 'ChillHop Records', 'Late Night Coding', '2:32', '2.1M', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 5),
('Midurnal Drive', 'Night Owl', 'Late Night Coding', '3:18', '780K', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 6),
('Coffee Ring', 'Lofi Bros', 'Late Night Coding', '3:02', '1.8M', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 7),
('Static Dreams', 'Ambient Sounds', 'Late Night Coding', '4:45', '560K', (SELECT id FROM playlists WHERE title = 'Late Night Coding' LIMIT 1), 8)
ON CONFLICT DO NOTHING;
