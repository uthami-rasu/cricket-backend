-- ========================================
-- DATA VERIFICATION QUERIES
-- For: team_players, match_players, matches, match_scores, match_details
-- ========================================

-- Query 1: Verify Team Players are properly linked to Teams, Players, and Seasons
-- This checks if all team_players have valid references
SELECT 
    tp.id AS team_player_id,
    t.name AS team_name,
    p.full_name AS player_name,
    s.name AS season_name,
    pd.label AS squad_role,
    tp.jersey_number,
    tp.is_active
FROM team_players tp
INNER JOIN teams t ON tp.team_id = t.id
INNER JOIN players p ON tp.player_id = p.id
INNER JOIN seasons s ON tp.season_id = s.id
INNER JOIN player_designations pd ON tp.squad_role_id = pd.id
ORDER BY t.name, tp.jersey_number;


-- Query 2: Verify Match Setup - Check all matches with teams and status
-- Ensures matches are properly configured with valid teams and seasons
SELECT 
    m.id AS match_id,
    s.name AS season,
    ht.name AS home_team,
    at.name AS away_team,
    m.venue,
    m.match_date,
    ms.label AS status,
    tw.name AS toss_winner,
    m.toss_decision
FROM matches m
INNER JOIN seasons s ON m.season_id = s.id
INNER JOIN teams ht ON m.home_team_id = ht.id
INNER JOIN teams at ON m.away_team_id = at.id
INNER JOIN match_statuses ms ON m.status_id = ms.id
LEFT JOIN teams tw ON m.toss_winner_team_id = tw.id
ORDER BY m.match_date DESC;


-- Query 3: Verify Match Players are linked correctly to Matches and Team Players
-- Identifies all players participating in matches with their roles
SELECT 
    mp.id AS match_player_id,
    m.id AS match_id,
    ht.name AS home_team,
    at.name AS away_team,
    t.name AS player_team,
    p.full_name AS player_name,
    mp.is_playing_xi,
    mp.is_substitute,
    mp.is_captain,
    mp.is_wicket_keeper,
    mp.batting_position
FROM match_players mp
INNER JOIN matches m ON mp.match_id = m.id
INNER JOIN team_players tp ON mp.team_player_id = tp.id
INNER JOIN teams t ON tp.team_id = t.id
INNER JOIN players p ON tp.player_id = p.id
INNER JOIN teams ht ON m.home_team_id = ht.id
INNER JOIN teams at ON m.away_team_id = at.id
ORDER BY m.id, t.name, mp.batting_position;


-- Query 4: Verify Match Details (Innings) are properly set up
-- Checks each innings with batting/bowling teams and opening batsmen
SELECT 
    md.id AS innings_id,
    m.id AS match_id,
    ht.name AS home_team,
    at.name AS away_team,
    md.innings_number,
    bt.name AS batting_team,
    bwt.name AS bowling_team,
    p1.full_name AS opening_batsman_1,
    p2.full_name AS opening_batsman_2
FROM match_details md
INNER JOIN matches m ON md.match_id = m.id
INNER JOIN teams ht ON m.home_team_id = ht.id
INNER JOIN teams at ON m.away_team_id = at.id
INNER JOIN teams bt ON md.batting_team_id = bt.id
INNER JOIN teams bwt ON md.bowling_team_id = bwt.id
LEFT JOIN match_players mp1 ON md.opening_batsman1_mp_id = mp1.id
LEFT JOIN team_players tp1 ON mp1.team_player_id = tp1.id
LEFT JOIN players p1 ON tp1.player_id = p1.id
LEFT JOIN match_players mp2 ON md.opening_batsman2_mp_id = mp2.id
LEFT JOIN team_players tp2 ON mp2.team_player_id = tp2.id
LEFT JOIN players p2 ON tp2.player_id = p2.id
ORDER BY m.id, md.innings_number;


-- Query 5: Verify Match Scores (Ball-by-Ball) Data Integrity
-- Shows detailed ball-by-ball data with all player references
SELECT 
    msc.id AS score_id,
    m.id AS match_id,
    md.innings_number,
    msc.over_number,
    msc.ball_number,
    msc.ball_type,
    batsman.full_name AS batsman,
    bowler.full_name AS bowler,
    non_striker.full_name AS non_striker,
    msc.runs_off_bat,
    msc.extras_type,
    msc.extras_runs,
    msc.is_wicket,
    msc.wicket_type,
    dismissed.full_name AS dismissed_batsman,
    fielder.full_name AS fielder
FROM match_scores msc
INNER JOIN matches m ON msc.match_id = m.id
INNER JOIN match_details md ON msc.innings_id = md.id
LEFT JOIN match_players mp_bat ON msc.batsman_mp_id = mp_bat.id
LEFT JOIN team_players tp_bat ON mp_bat.team_player_id = tp_bat.id
LEFT JOIN players batsman ON tp_bat.player_id = batsman.id
INNER JOIN match_players mp_bowl ON msc.bowler_mp_id = mp_bowl.id
INNER JOIN team_players tp_bowl ON mp_bowl.team_player_id = tp_bowl.id
INNER JOIN players bowler ON tp_bowl.player_id = bowler.id
LEFT JOIN match_players mp_ns ON msc.non_striker_mp_id = mp_ns.id
LEFT JOIN team_players tp_ns ON mp_ns.team_player_id = tp_ns.id
LEFT JOIN players non_striker ON tp_ns.player_id = non_striker.id
LEFT JOIN match_players mp_dis ON msc.dismissed_batsman_mp_id = mp_dis.id
LEFT JOIN team_players tp_dis ON mp_dis.team_player_id = tp_dis.id
LEFT JOIN players dismissed ON tp_dis.player_id = dismissed.id
LEFT JOIN match_players mp_fld ON msc.fielder_mp_id = mp_fld.id
LEFT JOIN team_players tp_fld ON mp_fld.team_player_id = tp_fld.id
LEFT JOIN players fielder ON tp_fld.player_id = fielder.id
ORDER BY msc.match_id, md.innings_number, msc.over_number, msc.ball_number
LIMIT 100;


-- Query 6: Count Statistics - Verify data completeness across tables
-- Quick overview of record counts in each table
SELECT 
    'Team Players' AS table_name, COUNT(*) AS record_count FROM team_players
UNION ALL
SELECT 'Matches', COUNT(*) FROM matches
UNION ALL
SELECT 'Match Players', COUNT(*) FROM match_players
UNION ALL
SELECT 'Match Details', COUNT(*) FROM match_details
UNION ALL
SELECT 'Match Scores', COUNT(*) FROM match_scores;


-- Query 7: Check for Orphaned Records - Match Players without valid references
-- Identifies data integrity issues
SELECT 
    mp.id AS match_player_id,
    mp.match_id,
    mp.team_player_id,
    CASE WHEN m.id IS NULL THEN 'Missing Match' ELSE 'OK' END AS match_status,
    CASE WHEN tp.id IS NULL THEN 'Missing Team Player' ELSE 'OK' END AS team_player_status
FROM match_players mp
LEFT JOIN matches m ON mp.match_id = m.id
LEFT JOIN team_players tp ON mp.team_player_id = tp.id
WHERE m.id IS NULL OR tp.id IS NULL;


-- Query 8: Innings Summary - Total runs, wickets, and balls per innings
-- Aggregates match_scores data to verify scoring calculations
SELECT 
    md.id AS innings_id,
    m.id AS match_id,
    bt.name AS batting_team,
    md.innings_number,
    COUNT(*) AS total_balls,
    SUM(msc.runs_off_bat) AS runs_off_bat,
    SUM(msc.extras_runs) AS extras,
    SUM(msc.runs_off_bat + msc.extras_runs) AS total_runs,
    SUM(CASE WHEN msc.is_wicket = true THEN 1 ELSE 0 END) AS wickets,
    CONCAT(
        FLOOR(COUNT(*) / 6), '.', 
        MOD(COUNT(*), 6)
    ) AS overs_completed
FROM match_scores msc
INNER JOIN match_details md ON msc.innings_id = md.id
INNER JOIN matches m ON md.match_id = m.id
INNER JOIN teams bt ON md.batting_team_id = bt.id
GROUP BY md.id, m.id, bt.name, md.innings_number
ORDER BY m.id, md.innings_number;


-- Query 9: Batsman Performance - Runs scored per batsman per match
-- Verifies batting statistics from match_scores
SELECT 
    m.id AS match_id,
    p.full_name AS batsman_name,
    t.name AS team,
    COUNT(*) AS balls_faced,
    SUM(msc.runs_off_bat) AS runs_scored,
    SUM(CASE WHEN msc.runs_off_bat = 4 THEN 1 ELSE 0 END) AS fours,
    SUM(CASE WHEN msc.runs_off_bat = 6 THEN 1 ELSE 0 END) AS sixes,
    SUM(CASE WHEN msc.is_wicket = true AND msc.dismissed_batsman_mp_id = mp.id THEN 1 ELSE 0 END) AS dismissals,
    ROUND(SUM(msc.runs_off_bat) * 100.0 / COUNT(*), 2) AS strike_rate
FROM match_scores msc
INNER JOIN match_players mp ON msc.batsman_mp_id = mp.id
INNER JOIN team_players tp ON mp.team_player_id = tp.id
INNER JOIN players p ON tp.player_id = p.id
INNER JOIN teams t ON tp.team_id = t.id
INNER JOIN matches m ON msc.match_id = m.id
GROUP BY m.id, p.full_name, t.name
ORDER BY m.id, runs_scored DESC;


-- Query 10: Bowler Performance - Wickets and runs conceded per bowler per match
-- Verifies bowling statistics from match_scores
SELECT 
    m.id AS match_id,
    p.full_name AS bowler_name,
    t.name AS team,
    COUNT(*) AS balls_bowled,
    SUM(msc.runs_off_bat + msc.extras_runs) AS runs_conceded,
    SUM(CASE WHEN msc.is_wicket = true THEN 1 ELSE 0 END) AS wickets,
    SUM(CASE WHEN msc.ball_type = 'wide' THEN 1 ELSE 0 END) AS wides,
    SUM(CASE WHEN msc.ball_type = 'no_ball' THEN 1 ELSE 0 END) AS no_balls,
    CONCAT(
        FLOOR(COUNT(*) / 6), '.', 
        MOD(COUNT(*), 6)
    ) AS overs_bowled,
    ROUND(SUM(msc.runs_off_bat + msc.extras_runs) * 6.0 / COUNT(*), 2) AS economy_rate
FROM match_scores msc
INNER JOIN match_players mp ON msc.bowler_mp_id = mp.id
INNER JOIN team_players tp ON mp.team_player_id = tp.id
INNER JOIN players p ON tp.player_id = p.id
INNER JOIN teams t ON tp.team_id = t.id
INNER JOIN matches m ON msc.match_id = m.id
GROUP BY m.id, p.full_name, t.name
ORDER BY m.id, wickets DESC, runs_conceded ASC;
