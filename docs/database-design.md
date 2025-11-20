# Cricket Backend Database Design

Complete database schema documentation for the cricket management system.

---

## 📊 Database Overview

This database is designed to manage cricket matches, teams, players, and ball-by-ball scoring. It consists of **4 main modules**:

1. **Master Data** - Reference/lookup tables
2. **Team & Player Management** - Team rosters and player information
3. **Match Management** - Match setup and configuration
4. **Scoring System** - Ball-by-ball match data

---

## 🔗 Entity Relationship Diagram (ASCII)

```
┌─────────────────┐
│  match_statuses │ (Master)
└────────┬────────┘
         │
         ├──────────────┐
         │              │
         v              v
    ┌─────────┐    ┌─────────┐
    │ seasons │    │ matches │
    └────┬────┘    └────┬────┘
         │              │
         │              ├─────────────┐
         │              │             │
         │              v             v
         │    ┌──────────────┐  ┌──────────────┐
         │    │match_details │  │match_players │
         │    └───────┬──────┘  └──────┬───────┘
         │            │                │
         │            └────────┬───────┘
         │                     │
         │                     v
         │           ┌─────────────────┐
         │           │  match_scores   │ (Ball-by-ball)
         │           └─────────────────┘
         │
         v
   ┌──────────────┐
   │team_players  │◄─────── players ◄──┬─── player_batting_styles
   └──────┬───────┘                    ├─── player_bowling_styles
          │                            ├─── player_positions
          ├──── teams ◄─── team_statuses
          │
          └──── player_designations


User & Permissions Module (Separate):
┌──────┐     ┌───────────────┐     ┌─────────────┐
│users │◄────│  user_roles   │────►│    roles    │
└──────┘     └───────────────┘     └──────┬──────┘
                                           │
                                           v
                                 ┌──────────────────┐
                                 │ role_permissions │
                                 └────────┬─────────┘
                                          │
                                          v
                                    ┌─────────────┐
                                    │ permissions │
                                    └─────────────┘
```

---

## 📋 Table Specifications

### 1. Master Data Tables

#### `match_statuses`
**Purpose:** Status codes for matches and seasons (Scheduled, Live, Completed, etc.)

| Field       | Data Type    | Constraints           | Description                    |
|-------------|--------------|----------------------|--------------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT   | Primary key                    |
| code        | VARCHAR(255) | NOT NULL, UNIQUE     | Status code (e.g., 'SCHEDULED')|
| label       | VARCHAR(255) | NOT NULL             | Display label                  |
| description | TEXT         | NULL                 | Detailed description           |
| sort_order  | INTEGER      | NULL                 | Display order                  |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1  | Active status                  |
| is_default  | BOOLEAN      | NOT NULL, DEFAULT 0  | Default status flag            |
| category    | VARCHAR(255) | NULL                 | Category grouping              |
| created_at  | TIMESTAMP    | NOT NULL             | Record creation time           |
| modified_at | TIMESTAMP    | NULL                 | Last modification time         |

**Foreign Keys:** None  
**Used By:** `seasons`, `matches`

---

#### `player_designations`
**Purpose:** Player squad roles (All-rounder, Batsman, Bowler, etc.)

| Field       | Data Type    | Constraints           | Description             |
|-------------|--------------|-----------------------|-------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT    | Primary key             |
| code        | VARCHAR(255) | NOT NULL, UNIQUE      | Role code               |
| label       | VARCHAR(255) | NOT NULL              | Display label           |
| description | TEXT         | NULL                  | Detailed description    |
| sort_order  | INTEGER      | NULL                  | Display order           |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1   | Active status           |
| created_at  | TIMESTAMP    | NOT NULL              | Record creation time    |
| modified_at | TIMESTAMP    | NULL                  | Last modification time  |

**Foreign Keys:** None  
**Used By:** `team_players`

---

#### `player_batting_styles`
**Purpose:** Batting styles (Right-hand, Left-hand)

| Field       | Data Type    | Constraints           | Description             |
|-------------|--------------|-----------------------|-------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT    | Primary key             |
| code        | VARCHAR(255) | NOT NULL, UNIQUE      | Style code              |
| label       | VARCHAR(255) | NOT NULL              | Display label           |
| description | TEXT         | NULL                  | Detailed description    |
| sort_order  | INTEGER      | NULL                  | Display order           |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1   | Active status           |
| created_at  | TIMESTAMP    | NOT NULL              | Record creation time    |
| modified_at | TIMESTAMP    | NULL                  | Last modification time  |

**Foreign Keys:** None  
**Used By:** `players`

---

#### `player_bowling_styles`
**Purpose:** Bowling styles (Right-arm, Left-arm)

| Field       | Data Type    | Constraints           | Description             |
|-------------|--------------|-----------------------|-------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT    | Primary key             |
| code        | VARCHAR(255) | NOT NULL, UNIQUE      | Style code              |
| label       | VARCHAR(255) | NOT NULL              | Display label           |
| description | TEXT         | NULL                  | Detailed description    |
| sort_order  | INTEGER      | NULL                  | Display order           |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1   | Active status           |
| created_at  | TIMESTAMP    | NOT NULL              | Record creation time    |
| modified_at | TIMESTAMP    | NULL                  | Last modification time  |

**Foreign Keys:** None  
**Used By:** `players`

---

#### `player_positions`
**Purpose:** Player positions (Batsman, Bowler, Wicket-keeper, etc.)

| Field       | Data Type    | Constraints           | Description             |
|-------------|--------------|-----------------------|-------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT    | Primary key             |
| code        | VARCHAR(255) | NOT NULL, UNIQUE      | Position code           |
| label       | VARCHAR(255) | NOT NULL              | Display label           |
| description | TEXT         | NULL                  | Detailed description    |
| sort_order  | INTEGER      | NULL                  | Display order           |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1   | Active status           |
| created_at  | TIMESTAMP    | NOT NULL              | Record creation time    |
| modified_at | TIMESTAMP    | NULL                  | Last modification time  |

**Foreign Keys:** None  
**Used By:** `players`

---

#### `team_statuses`
**Purpose:** Team status codes (Active, Inactive, Disbanded)

| Field       | Data Type    | Constraints           | Description             |
|-------------|--------------|-----------------------|-------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT    | Primary key             |
| code        | VARCHAR(255) | NOT NULL, UNIQUE      | Status code             |
| label       | VARCHAR(255) | NOT NULL              | Display label           |
| description | TEXT         | NULL                  | Detailed description    |
| sort_order  | INTEGER      | NULL                  | Display order           |
| is_active   | BOOLEAN      | NOT NULL, DEFAULT 1   | Active status           |
| created_at  | TIMESTAMP    | NOT NULL              | Record creation time    |
| modified_at | TIMESTAMP    | NULL                  | Last modification time  |

**Foreign Keys:** None  
**Used By:** `teams`

---

### 2. Player & Team Management Tables

#### `players`
**Purpose:** Individual player information and attributes

| Field             | Data Type    | Constraints                              | Description                |
|-------------------|--------------|------------------------------------------|----------------------------|
| id                | INTEGER      | PK, AUTO_INCREMENT                       | Primary key                |
| first_name        | VARCHAR(255) | NOT NULL                                 | Player's first name        |
| last_name         | VARCHAR(255) | NULL                                     | Player's last name         |
| full_name         | VARCHAR(255) | NOT NULL                                 | Player's full name         |
| date_of_birth     | DATE         | NULL                                     | Date of birth              |
| nationality       | VARCHAR(255) | NULL                                     | Player nationality         |
| batting_style_id  | INTEGER      | FK → player_batting_styles.id            | Batting style reference    |
| bowling_style_id  | INTEGER      | FK → player_bowling_styles.id            | Bowling style reference    |
| position_id       | INTEGER      | FK → player_positions.id                 | Primary position           |
| image_url         | VARCHAR(255) | NULL                                     | Player photo URL           |
| created_by        | VARCHAR(255) | NULL                                     | Created by user            |
| created_at        | TIMESTAMP    | NOT NULL                                 | Record creation time       |
| modified_by       | VARCHAR(255) | NULL                                     | Modified by user           |
| modified_at       | TIMESTAMP    | NULL                                     | Last modification time     |

**Foreign Keys:**
- `batting_style_id` → `player_batting_styles.id`
- `bowling_style_id` → `player_bowling_styles.id`
- `position_id` → `player_positions.id`

**Used By:** Many-to-Many with `teams` through `team_players`

---

#### `teams`
**Purpose:** Team information and details

| Field        | Data Type    | Constraints                      | Description                |
|--------------|--------------|----------------------------------|----------------------------|
| id           | INTEGER      | PK, AUTO_INCREMENT               | Primary key                |
| name         | VARCHAR(255) | NOT NULL                         | Full team name             |
| short_name   | VARCHAR(255) | NOT NULL                         | Abbreviated team name      |
| logo_url     | VARCHAR(255) | NULL                             | Team logo URL              |
| home_city    | VARCHAR(255) | NULL                             | Team's home city           |
| coach_name   | VARCHAR(255) | NULL                             | Head coach name            |
| home_ground  | VARCHAR(255) | NULL                             | Home ground/stadium        |
| year_founded | INTEGER      | NULL                             | Year team was established  |
| status_id    | INTEGER      | FK → team_statuses.id, DEFAULT 1 | Team status                |
| created_by   | VARCHAR(255) | NULL                             | Created by user            |
| created_at   | TIMESTAMP    | NOT NULL                         | Record creation time       |
| modified_by  | VARCHAR(255) | NULL                             | Modified by user           |
| modified_at  | TIMESTAMP    | NULL                             | Last modification time     |

**Foreign Keys:**
- `status_id` → `team_statuses.id`

**Used By:** `matches`, `team_players`, `match_details`

---

#### `seasons`
**Purpose:** Cricket seasons/tournaments

| Field       | Data Type    | Constraints                              | Description                |
|-------------|--------------|------------------------------------------|----------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT                       | Primary key                |
| year        | INTEGER      | NOT NULL                                 | Season year                |
| name        | VARCHAR(255) | NOT NULL                                 | Season name (e.g., IPL 2024)|
| start_date  | DATE         | NULL                                     | Season start date          |
| end_date    | DATE         | NULL                                     | Season end date            |
| status_id   | INTEGER      | FK → match_statuses.id, DEFAULT 2        | Season status              |
| created_by  | VARCHAR(255) | NULL                                     | Created by user            |
| created_at  | TIMESTAMP    | NOT NULL                                 | Record creation time       |
| modified_by | VARCHAR(255) | NULL                                     | Modified by user           |
| modified_at | TIMESTAMP    | NULL                                     | Last modification time     |

**Foreign Keys:**
- `status_id` → `match_statuses.id`

**Used By:** `matches`, `team_players`

---

#### `team_players`
**Purpose:** Links players to teams for a specific season (squad roster)

| Field         | Data Type    | Constraints                              | Description                |
|---------------|--------------|------------------------------------------|----------------------------|
| id            | INTEGER      | PK, AUTO_INCREMENT                       | Primary key                |
| team_id       | INTEGER      | FK → teams.id, NOT NULL                  | Team reference             |
| player_id     | INTEGER      | FK → players.id, NOT NULL                | Player reference           |
| season_id     | INTEGER      | FK → seasons.id, NOT NULL                | Season reference           |
| squad_role_id | INTEGER      | FK → player_designations.id, DEFAULT 4   | Squad role                 |
| jersey_number | INTEGER      | NULL                                     | Player's jersey number     |
| is_active     | BOOLEAN      | NOT NULL, DEFAULT 1                      | Active in squad            |
| created_by    | VARCHAR(255) | NULL                                     | Created by user            |
| created_at    | TIMESTAMP    | NOT NULL                                 | Record creation time       |
| modified_by   | VARCHAR(255) | NULL                                     | Modified by user           |
| modified_at   | TIMESTAMP    | NULL                                     | Last modification time     |

**Foreign Keys:**
- `team_id` → `teams.id`
- `player_id` → `players.id`
- `season_id` → `seasons.id`
- `squad_role_id` → `player_designations.id`

**Used By:** `match_players`

---

### 3. Match Management Tables

#### `matches`
**Purpose:** Match information and configuration

| Field               | Data Type      | Constraints                         | Description                |
|---------------------|----------------|-------------------------------------|----------------------------|
| id                  | INTEGER        | PK, AUTO_INCREMENT                  | Primary key                |
| season_id           | INTEGER        | FK → seasons.id, NOT NULL           | Season reference           |
| home_team_id        | INTEGER        | FK → teams.id, NOT NULL             | Home team                  |
| away_team_id        | INTEGER        | FK → teams.id, NOT NULL             | Away team                  |
| venue               | VARCHAR(150)   | NULL                                | Match venue                |
| match_date          | DATE           | NULL                                | Match date                 |
| match_time          | DATETIME       | NULL                                | Match start time           |
| status_id           | INTEGER        | FK → match_statuses.id, NOT NULL    | Match status               |
| toss_winner_team_id | INTEGER        | FK → teams.id, NULL                 | Toss winner                |
| toss_decision       | ENUM           | 'bat' or 'field', NULL              | Toss decision              |
| created_by          | VARCHAR(50)    | NULL                                | Created by user            |
| created_at          | TIMESTAMP      | NOT NULL                            | Record creation time       |
| modified_by         | VARCHAR(50)    | NULL                                | Modified by user           |
| updated_at          | TIMESTAMP      | NULL                                | Last modification time     |

**Foreign Keys:**
- `season_id` → `seasons.id`
- `home_team_id` → `teams.id`
- `away_team_id` → `teams.id`
- `toss_winner_team_id` → `teams.id`
- `status_id` → `match_statuses.id`

**Used By:** `match_details`, `match_players`, `match_scores`

---

#### `match_players`
**Purpose:** Players participating in a specific match

| Field            | Data Type | Constraints                         | Description                    |
|------------------|-----------|-------------------------------------|--------------------------------|
| id               | INTEGER   | PK, AUTO_INCREMENT                  | Primary key                    |
| match_id         | INTEGER   | FK → matches.id, NOT NULL           | Match reference                |
| team_player_id   | INTEGER   | FK → team_players.id, NOT NULL      | Team player reference          |
| is_playing_xi    | BOOLEAN   | NOT NULL, DEFAULT 1                 | In playing 11                  |
| is_substitute    | BOOLEAN   | NOT NULL, DEFAULT 0                 | Is substitute player           |
| batting_position | INTEGER   | NULL                                | Batting order position         |
| is_captain       | BOOLEAN   | NOT NULL, DEFAULT 0                 | Team captain                   |
| is_wicket_keeper | BOOLEAN   | NOT NULL, DEFAULT 0                 | Wicket keeper                  |
| created_at       | TIMESTAMP | NOT NULL                            | Record creation time           |
| updated_at       | TIMESTAMP | NULL                                | Last modification time         |

**Foreign Keys:**
- `match_id` → `matches.id` (CASCADE on delete)
- `team_player_id` → `team_players.id`

**Used By:** `match_details`, `match_scores`

---

#### `match_details`
**Purpose:** Innings details for each match

| Field                    | Data Type | Constraints                         | Description                    |
|--------------------------|-----------|-------------------------------------|--------------------------------|
| id                       | INTEGER   | PK, AUTO_INCREMENT                  | Primary key                    |
| match_id                 | INTEGER   | FK → matches.id, NOT NULL           | Match reference                |
| innings_number           | INTEGER   | NOT NULL                            | Innings number (1, 2, 3, 4)    |
| batting_team_id          | INTEGER   | FK → teams.id, NOT NULL             | Batting team                   |
| bowling_team_id          | INTEGER   | FK → teams.id, NOT NULL             | Bowling team                   |
| opening_batsman1_mp_id   | INTEGER   | FK → match_players.id, NULL         | First opener                   |
| opening_batsman2_mp_id   | INTEGER   | FK → match_players.id, NULL         | Second opener                  |
| created_at               | TIMESTAMP | NOT NULL                            | Record creation time           |
| updated_at               | TIMESTAMP | NULL                                | Last modification time         |

**Foreign Keys:**
- `match_id` → `matches.id` (CASCADE on delete)
- `batting_team_id` → `teams.id` (RESTRICT on delete)
- `bowling_team_id` → `teams.id` (RESTRICT on delete)
- `opening_batsman1_mp_id` → `match_players.id` (SET NULL on delete)
- `opening_batsman2_mp_id` → `match_players.id` (SET NULL on delete)

**Unique Constraints:**
- UK: (`match_id`, `innings_number`) - One innings record per match innings

**Used By:** `match_scores`

---

### 4. Scoring System Tables

#### `match_scores`
**Purpose:** Ball-by-ball scoring data (most granular level)

| Field                    | Data Type | Constraints                         | Description                          |
|--------------------------|-----------|-------------------------------------|--------------------------------------|
| id                       | INTEGER   | PK, AUTO_INCREMENT                  | Primary key                          |
| match_id                 | INTEGER   | FK → matches.id, NOT NULL           | Match reference                      |
| innings_id               | INTEGER   | FK → match_details.id, NOT NULL     | Innings reference                    |
| over_number              | INTEGER   | NOT NULL                            | Over number                          |
| ball_number              | INTEGER   | NOT NULL                            | Ball number (1-6)                    |
| ball_type                | ENUM      | 'fair', 'wide', 'no_ball', 'dead'   | Type of delivery                     |
| batsman_mp_id            | INTEGER   | FK → match_players.id, NULL         | Striker batsman                      |
| bowler_mp_id             | INTEGER   | FK → match_players.id, NOT NULL     | Bowler                               |
| non_striker_mp_id        | INTEGER   | FK → match_players.id, NULL         | Non-striker batsman                  |
| runs_off_bat             | INTEGER   | NOT NULL, DEFAULT 0                 | Runs scored off bat                  |
| extras_type              | ENUM      | 'none', 'wide', 'no_ball', 'bye',   | Type of extras                       |
|                          |           | 'leg_bye', 'penalty'                |                                      |
| extras_runs              | INTEGER   | NOT NULL, DEFAULT 0                 | Extra runs                           |
| is_wicket                | BOOLEAN   | NOT NULL, DEFAULT 0                 | Is wicket taken                      |
| wicket_type              | ENUM      | 'bowled', 'caught', 'lbw',          | Type of dismissal                    |
|                          |           | 'runout', 'stumped', 'hit_wicket',  |                                      |
|                          |           | 'retired_hurt', 'obstructing', 'none'|                                     |
| dismissed_batsman_mp_id  | INTEGER   | FK → match_players.id, NULL         | Dismissed batsman                    |
| fielder_mp_id            | INTEGER   | FK → match_players.id, NULL         | Fielder involved in dismissal        |
| is_free_hit              | BOOLEAN   | NOT NULL, DEFAULT 0                 | Is free hit delivery                 |
| commentary               | TEXT      | NULL                                | Ball commentary                      |
| event_timestamp          | DATETIME  | NULL                                | Timestamp of event                   |
| created_at               | TIMESTAMP | NOT NULL                            | Record creation time                 |
| updated_at               | TIMESTAMP | NULL                                | Last modification time               |

**Foreign Keys:**
- `match_id` → `matches.id` (CASCADE on delete)
- `innings_id` → `match_details.id` (CASCADE on delete)
- `batsman_mp_id` → `match_players.id` (SET NULL on delete)
- `bowler_mp_id` → `match_players.id` (RESTRICT on delete)
- `non_striker_mp_id` → `match_players.id` (SET NULL on delete)
- `dismissed_batsman_mp_id` → `match_players.id` (SET NULL on delete)
- `fielder_mp_id` → `match_players.id` (SET NULL on delete)

**Unique Constraints:**
- UK: (`match_id`, `innings_id`, `over_number`, `ball_number`) - One record per ball

**Indexes:**
- `idx_match_scores_match_id`
- `idx_match_scores_innings_id`
- `idx_match_scores_batsman_mp_id`
- `idx_match_scores_bowler_mp_id`

---

### 5. User & Permission Tables (Optional Module)

#### `users`
**Purpose:** System users/administrators

| Field      | Data Type    | Constraints        | Description            |
|------------|--------------|--------------------|------------------------|
| id         | INTEGER      | PK, AUTO_INCREMENT | Primary key            |
| username   | VARCHAR(255) | NOT NULL, UNIQUE   | Unique username        |
| email      | VARCHAR(255) | NOT NULL, UNIQUE   | User email             |
| password   | VARCHAR(255) | NOT NULL           | Hashed password        |
| created_at | TIMESTAMP    | NOT NULL           | Record creation time   |
| updated_at | TIMESTAMP    | NULL               | Last modification time |

---

#### `roles`
**Purpose:** User roles (Admin, Scorer, Viewer, etc.)

| Field       | Data Type    | Constraints        | Description            |
|-------------|--------------|--------------------|------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT | Primary key            |
| name        | VARCHAR(255) | NOT NULL, UNIQUE   | Role name              |
| description | TEXT         | NULL               | Role description       |
| created_at  | TIMESTAMP    | NOT NULL           | Record creation time   |
| updated_at  | TIMESTAMP    | NULL               | Last modification time |

---

#### `permissions`
**Purpose:** System permissions (create_match, score_match, etc.)

| Field       | Data Type    | Constraints        | Description               |
|-------------|--------------|--------------------|---------------------------|
| id          | INTEGER      | PK, AUTO_INCREMENT | Primary key               |
| name        | VARCHAR(255) | NOT NULL, UNIQUE   | Permission name           |
| description | TEXT         | NULL               | Permission description    |
| created_at  | TIMESTAMP    | NOT NULL           | Record creation time      |
| updated_at  | TIMESTAMP    | NULL               | Last modification time    |

---

#### `user_roles`
**Purpose:** Many-to-many link between users and roles

| Field   | Data Type | Constraints                  | Description      |
|---------|-----------|------------------------------|------------------|
| id      | INTEGER   | PK, AUTO_INCREMENT           | Primary key      |
| user_id | INTEGER   | FK → users.id, NOT NULL      | User reference   |
| role_id | INTEGER   | FK → roles.id, NOT NULL      | Role reference   |

**Unique Constraints:**
- UK: (`user_id`, `role_id`)

---

#### `role_permissions`
**Purpose:** Many-to-many link between roles and permissions

| Field         | Data Type | Constraints                       | Description          |
|---------------|-----------|-----------------------------------|----------------------|
| id            | INTEGER   | PK, AUTO_INCREMENT                | Primary key          |
| role_id       | INTEGER   | FK → roles.id, NOT NULL           | Role reference       |
| permission_id | INTEGER   | FK → permissions.id, NOT NULL     | Permission reference |

**Unique Constraints:**
- UK: (`role_id`, `permission_id`)

---

## 🔄 Table Relationships Explained

### **Core Cricket Module Flow:**

1. **Season Setup:**
   - `seasons` table holds tournament information
   - Status tracked via `match_statuses`

2. **Team & Player Setup:**
   - `teams` stores team information
   - `players` stores individual player data
   - `team_players` links players to teams for a specific season (squad roster)

3. **Match Creation:**
   - `matches` created with home/away teams, linked to a season
   - Status tracked via `match_statuses`

4. **Player Selection:**
   - `match_players` records which players from each team participate
   - References `team_players` (not directly to `players`)
   - Tracks captain, wicket-keeper, playing XI, substitutes

5. **Innings Setup:**
   - `match_details` records each innings
   - Links batting/bowling teams
   - References opening batsmen via `match_players`

6. **Ball-by-Ball Scoring:**
   - `match_scores` stores every delivery
   - References batsman, bowler, non-striker, fielder via `match_players`
   - Tracks runs, wickets, extras, commentary

---

## 🎯 Key Design Principles

### **1. Normalized Structure:**
- Master data in separate lookup tables
- No duplicate team/player data across seasons
- Junction tables for many-to-many relationships

### **2. Referential Integrity:**
- Foreign keys with appropriate CASCADE/RESTRICT/SET NULL
- Unique constraints prevent duplicate data
- Indexes on frequently queried columns

### **3. Temporal Tracking:**
- All tables have `created_at`/`updated_at` or `modified_at`
- `created_by`/`modified_by` for audit trails

### **4. Flexible Enum Types:**
- Status codes in database tables (not hardcoded enums)
- Allows dynamic addition of new statuses
- `is_active` flags for soft deletes

### **5. Performance Optimization:**
- Composite unique indexes prevent duplicate balls
- Indexes on foreign keys for join performance
- Separate innings table reduces match_scores complexity

---

## 📝 Data Flow Example

**Creating a match with scoring:**

```
1. Create Season
   └─> seasons (id: 1, name: "IPL 2024")

2. Create Teams
   ├─> teams (id: 1, name: "Mumbai Indians")
   └─> teams (id: 2, name: "Chennai Super Kings")

3. Add Players to Teams
   ├─> players (id: 1, full_name: "Rohit Sharma")
   ├─> players (id: 2, full_name: "MS Dhoni")
   ├─> team_players (team_id: 1, player_id: 1, season_id: 1)
   └─> team_players (team_id: 2, player_id: 2, season_id: 1)

4. Create Match
   └─> matches (home_team_id: 1, away_team_id: 2, season_id: 1)

5. Select Match Squad
   ├─> match_players (match_id: 1, team_player_id: 1, is_captain: true)
   └─> match_players (match_id: 1, team_player_id: 2, is_captain: true)

6. Create Innings
   └─> match_details (match_id: 1, innings_number: 1, batting_team_id: 1)

7. Record Deliveries
   ├─> match_scores (innings_id: 1, over: 1, ball: 1, runs_off_bat: 4)
   └─> match_scores (innings_id: 1, over: 1, ball: 2, is_wicket: true)
```

---

## 🔑 Important Constraints

### **Unique Constraints:**
- `match_details`: (`match_id`, `innings_number`) - One innings per number
- `match_scores`: (`match_id`, `innings_id`, `over_number`, `ball_number`) - One record per ball

### **Cascade Behaviors:**
- **CASCADE**: `matches` deleted → `match_details`, `match_players`, `match_scores` deleted
- **RESTRICT**: Cannot delete `teams` if referenced in `matches` (protect data integrity)
- **SET NULL**: Deleting `match_players` → nulls player references in `match_scores`

---

## 📊 Statistics Generation

The schema supports generating:
- **Player stats**: Aggregate `match_scores` by `batsman_mp_id` or `bowler_mp_id`
- **Team stats**: Join through `match_players` → `team_players` → `teams`
- **Match summaries**: Aggregate `match_scores` by `innings_id` or `match_id`
- **Season standings**: Aggregate match results by `season_id`

---

**End of Database Design Document**
