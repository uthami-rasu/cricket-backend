# Teams & Players Management Module

## Overview

This module handles cricket team and player management with support for multi-season tracking, historical data, and flexible role assignments. The schema is designed to scale from local leagues to professional tournament systems like IPL, BBL, and ICC competitions.

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│     TEAMS       │       │   TEAM_PLAYERS  │       │    PLAYERS      │
├─────────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)         │──────▶│ team_id (FK)    │◀──────│ id (PK)         │
│ name            │       │ player_id (FK)  │       │ first_name      │
│ short_name      │       │ season_id (FK)  │       │ last_name       │
│ profile_url     │       │ squad_role      │       │ full_name       │
│ home_city       │       │ jersey_number   │       │ date_of_birth   │
│ coach_name      │       │ contract_start  │       │ nationality     │
│ home_ground     │       │ contract_end    │       │ batting_style   │
│ year_founded    │       │ is_active       │       │ bowling_style   │
│ status          │       └─────────────────┘       │ role            │
└─────────────────┘                │                │ profile_url     │
                                   │                └─────────────────┘
                                   ▼
                        ┌─────────────────┐
                        │    SEASONS      │
                        ├─────────────────┤
                        │ id (PK)         │
                        │ year            │
                        │ name            │
                        │ start_date      │
                        │ end_date        │
                        │ status          │
                        └─────────────────┘
```

> **Audit columns:** Every table also includes `created_at`, `created_by`, `modified_at`, `modified_by`. They are omitted in the diagrams and tables below for clarity.

### Core Tables Structure

#### 1. `teams` - Team Information

| Field        | Type         | Description                           |
| ------------ | ------------ | ------------------------------------- |
| id           | Integer (PK) | Unique team identifier                |
| name         | String       | Full team name (unique)               |
| short_name   | String       | Team abbreviation (e.g., "MI", "CSK") |
| profile_url  | String       | Team logo image URL                   |
| home_city    | String       | Team's home city                      |
| coach_name   | String       | Current head coach                    |
| home_ground  | String       | Home stadium/ground                   |
| year_founded | Integer      | Year team was established             |
| status       | Enum         | 'active' or 'inactive'                |

#### 2. `players` - Player Master Registry

| Field         | Type         | Description                       |
| ------------- | ------------ | --------------------------------- |
| id            | Integer (PK) | Unique player identifier          |
| first_name    | String       | Player's first name               |
| last_name     | String       | Player's last name                |
| full_name     | String       | Complete player name              |
| date_of_birth | Date         | Birth date                        |
| nationality   | String       | Player's nationality              |
| batting_style | Enum         | 'right_hand' or 'left_hand'       |
| bowling_style | Enum         | Fast/spin bowling style           |
| role          | Enum         | Primary role (batsman/bowler/etc) |
| profile_url   | String       | Player photo URL                  |

#### 3. `seasons` - Tournament Seasons

| Field      | Type         | Description                       |
| ---------- | ------------ | --------------------------------- |
| id         | Integer (PK) | Unique season identifier          |
| year       | Integer      | Season year                       |
| name       | String       | Season name (e.g., "IPL 2024")    |
| start_date | Date         | Tournament start date             |
| end_date   | Date         | Tournament end date               |
| status     | Enum         | 'upcoming', 'active', 'completed' |

#### 4. `team_players` - Player-Team Assignments

| Field         | Type         | Description                                                                |
| ------------- | ------------ | -------------------------------------------------------------------------- |
| id            | Integer (PK) | Unique assignment identifier                                               |
| team_id       | Integer (FK) | Reference to teams table                                                   |
| player_id     | Integer (FK) | Reference to players table                                                 |
| season_id     | Integer (FK) | Reference to seasons table                                                 |
| squad_role    | Enum         | 'captain', 'vice_captain', 'wicket_keeper', 'regular_player'               |
| jersey_number | Integer      | Player's jersey number for this team (different teams = different numbers) |
| is_active     | Boolean      | Current active status                                                      |

## Relationships

### 1. Teams ↔ Players (Many-to-Many)

- **Relationship**: A team can have many players, and a player can play for multiple teams across different seasons
- **Implementation**: Through `team_players` junction table
- **Key Benefits**:
  - Historical tracking of player movements
  - Support for player transfers between seasons
  - Flexible role assignments per team

### 2. Seasons → Team Players (One-to-Many)

- **Relationship**: Each season can have multiple team-player assignments
- **Implementation**: `season_id` foreign key in `team_players`
- **Key Benefits**:
  - Multi-season tournament support
  - Historical squad composition tracking
  - Season-specific role assignments

## Sample Data

### Teams Data

| id  | name                        | short_name | home_city | coach_name         | home_ground              | year_founded | status |
| --- | --------------------------- | ---------- | --------- | ------------------ | ------------------------ | ------------ | ------ |
| 1   | Mumbai Indians              | MI         | Mumbai    | Mahela Jayawardene | Wankhede Stadium         | 2008         | active |
| 2   | Chennai Super Kings         | CSK        | Chennai   | Stephen Fleming    | M.A. Chidambaram Stadium | 2008         | active |
| 3   | Royal Challengers Bangalore | RCB        | Bangalore | Andy Flower        | M. Chinnaswamy Stadium   | 2008         | active |
| 4   | Delhi Capitals              | DC         | Delhi     | Ricky Ponting      | Arun Jaitley Stadium     | 2008         | active |

### Players Data

| id  | first_name     | last_name | full_name             | date_of_birth | nationality | batting_style | bowling_style  | role          |
| --- | -------------- | --------- | --------------------- | ------------- | ----------- | ------------- | -------------- | ------------- |
| 1   | Rohit          | Sharma    | Rohit Gurunath Sharma | 1987-04-30    | Indian      | right_hand    | right_arm_spin | batsman       |
| 2   | Mahendra Singh | Dhoni     | Mahendra Singh Dhoni  | 1981-07-07    | Indian      | right_hand    | none           | wicket_keeper |
| 3   | Virat          | Kohli     | Virat Kohli           | 1988-11-05    | Indian      | right_hand    | right_arm_fast | batsman       |
| 4   | Rishabh        | Pant      | Rishabh Rajendra Pant | 1997-10-04    | Indian      | left_hand     | none           | wicket_keeper |

### Seasons Data

| id  | year | name     | start_date | end_date   | status    |
| --- | ---- | -------- | ---------- | ---------- | --------- |
| 1   | 2024 | IPL 2024 | 2024-03-22 | 2024-05-26 | completed |
| 2   | 2025 | IPL 2025 | 2025-03-20 | 2025-05-25 | upcoming  |

### Team Players Data (Player-Team Assignments)

| id  | team_id | player_id | season_id | squad_role     | jersey_number | is_active |
| --- | ------- | --------- | --------- | -------------- | ------------- | --------- |
| 1   | 1       | 1         | 1         | captain        | 45            | true      |
| 2   | 1       | 1         | 2         | captain        | 45            | true      |
| 3   | 2       | 2         | 1         | captain        | 7             | true      |
| 4   | 2       | 2         | 2         | captain        | 7             | true      |
| 5   | 3       | 3         | 1         | regular_player | 18            | true      |
| 6   | 3       | 3         | 2         | regular_player | 18            | true      |
| 7   | 4       | 4         | 1         | wicket_keeper  | 17            | true      |
| 8   | 4       | 4         | 2         | captain        | 17            | true      |

## Current Implementation Features

### 1. Data Storage Structure

- **Teams**: Store team information and metadata
- **Players**: Master registry of all players
- **Seasons**: Tournament/season definitions
- **Team Players**: Link players to teams with role and jersey info

### 2. Multi-Season Tracking

- Players can be assigned to different teams across seasons
- Historical squad compositions are maintained
- Same player can have different roles/jersey numbers per team

### 3. Role Identification

- **Captain**: Identified by `squad_role = 'captain'` in team_players
- **Vice Captain**: `squad_role = 'vice_captain'`
- **Wicket Keeper**: `squad_role = 'wicket_keeper'`
- **Regular Player**: `squad_role = 'regular_player'`

### 4. Jersey Number Management

- Jersey numbers stored per team assignment (team_players table)
- Same player can have different jersey numbers for different teams
- No validation currently implemented for duplicate numbers

### 5. Basic Contract Data

- Contract start/end dates stored
- Active/inactive status tracking
- **Note**: No automated contract management or validation currently implemented

## Data Flow Examples

### Example: Player Career Journey

**Rishabh Pant's Role Evolution:**

- **2024 Season**: Wicket Keeper for Delhi Capitals (Jersey #17)
- **2025 Season**: Promoted to Captain for Delhi Capitals (Jersey #17)

This shows how `team_players` tracks role changes across seasons while maintaining historical data.

### Example: Multi-Season Team Composition

**Mumbai Indians Leadership:**

- Rohit Sharma remains Captain across both 2024 and 2025 seasons
- Jersey number (45) stays consistent
- Contract details track year-by-year agreements

### Example: Cross-Team Analytics

Using the sample data, you can identify:

- **Team Captains**: Query `squad_role = 'captain'` → Rohit (MI), Dhoni (CSK), Pant (DC 2025)
- **Wicket Keepers**: Query `squad_role = 'wicket_keeper'` → Dhoni (CSK), Pant (DC 2024)
- **Player History**: Track player's teams across different seasons
- **Jersey Numbers**: Same player (Pant) keeps #17 across seasons but could have different numbers for different teams
