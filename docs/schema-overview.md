# Cricket Schema Overview

## 1. Core Domain Tables

| Table          | Primary Key                | Description                                                                                          |
| -------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| `players`      | `id` (INT, auto-increment) | Stores player bios and the foreign keys to batting style, bowling style, and primary position.       |
| `teams`        | `id` (INT, auto-increment) | Franchise/team metadata including status reference.                                                  |
| `team_players` | `id` (INT, auto-increment) | Join table that records which player was part of which team for a given season and their squad role. |
| `seasons`      | `id` (INT, auto-increment) | Tournament/league seasons with start/end dates and a status enum.                                    |

### players

- **Key columns:**
  - `full_name` (string, required)
  - `batting_style_id` → `player_batting_styles.id` (nullable, FK, `CASCADE` update / `SET NULL` delete)
  - `bowling_style_id` → `player_bowling_styles.id`
  - `position_id` → `player_positions.id`
- **Purpose:** Represents an individual player. Lookup references are optional so a player can exist without a fully defined style or position.

### teams

- **Key columns:**
  - `name`, `short_name` (strings, required)
  - `status_id` → `team_statuses.id` (required, FK, `CASCADE` update / `RESTRICT` delete)
- **Purpose:** Captures team identity and links to a status (active, inactive, etc.). Deleting a status that is in use is restricted.

### team_players

- **Key columns:**
  - `team_id` → `teams.id` (FK, `CASCADE` delete)
  - `player_id` → `players.id` (FK, `CASCADE` delete)
  - `season_id` → `seasons.id` (FK, `CASCADE` delete)
  - `squad_role_id` → `player_designations.id` (FK, `RESTRICT` delete)
  - Composite unique constraint on (`team_id`, `player_id`, `season_id`)
- **Purpose:** Roster assignments linking a player to a team for a season, with supporting fields like `jersey_number`, `is_active`.

### seasons

- **Key columns:**
  - `year` (INT), `name` (string)
  - `status` (ENUM of match status values; default `scheduled`)
- **Purpose:** Defines competition seasons that drive roster scoping in `team_players`.

## 2. Lookup/Master Tables

| Table                   | Primary Key | Unique Columns | Description                                                                      |
| ----------------------- | ----------- | -------------- | -------------------------------------------------------------------------------- |
| `player_designations`   | `id`        | `code`         | Squad roles such as captain or wicket keeper.                                    |
| `player_batting_styles` | `id`        | `code`         | Batting orientation lookup.                                                      |
| `player_bowling_styles` | `id`        | `code`         | Bowling style lookup.                                                            |
| `player_bowling_types`  | `id`        | `code`         | Bowling speed/type categories (not directly referenced by `players` but seeded). |
| `player_positions`      | `id`        | `code`         | Primary role classifications (batting/bowling/all-rounder).                      |
| `team_statuses`         | `id`        | `code`         | Status values for teams (active/inactive/etc.).                                  |
| `match_statuses`        | `id`        | `code`         | Used by `seasons.status` enum values.                                            |

Each lookup table shares a similar structure:

- Metadata columns (`label`, `description`, `sort_order`, `is_active`, audit fields).
- `code` column is unique and used by seeds/configuration to reference the rows.
- Populated by `20251120102000-master-seeder.js`.

## 3. Relationships Summary

- **players → player_batting_styles / player_bowling_styles / player_positions**
  - Optional FK references so that deleting a lookup row sets the corresponding player field to `NULL`.
- **teams → team_statuses**
  - Required FK; prevents deletion of a status in use.
- **team_players → teams, players, seasons, player_designations**
  - Core intersection of team rosters per season.
  - Cascade deletes for team/player/season keep the join table clean.
  - Squad role uses a lookup row; deletion is restricted to preserve assignments.
- **seasons**
  - Independent table whose `status` column is an ENUM defined from the `match_status` constants. The enumerated values should match the corresponding master seed.

## 4. Example Usage Patterns (Narrative)

1. **Creating a Player**

   - Insert into `player_batting_styles`, `player_bowling_styles`, `player_positions` via master seed if not already present.
   - Insert into `players` with the appropriate foreign key IDs.

2. **Registering a Team**

   - Ensure desired status exists in `team_statuses`.
   - Insert into `teams` referencing the status ID.

3. **Assigning Players to a Team for a Season**

   - Verify `seasons` entry exists for the target year.
   - Insert into `team_players` providing team, player, season, and squad role IDs. The unique constraint on (`team_id`, `player_id`, `season_id`) ensures only one record per combination.

4. **Master Data Flow**
   - `20251120102000-master-seeder.js` seeds all lookup tables.
   - `20251120103000-core-entities-seeder.js` reads the lookup rows by `code` and populates `players`, `teams`, `seasons`, and `team_players` with the correct foreign keys.

## 5. Maintenance Notes

- When adding new codes to lookup tables, update `utils/constants.js` so seeds and application logic stay in sync.
- If a lookup entry must be removed, check for referencing rows first. For example, `team_players` references `player_designations` with `RESTRICT` delete, so you must move or delete dependent records before removing a designation.
- To reset the domain data during development, you can truncate `team_players`, `teams`, `players`, and `seasons` (in that order to satisfy FK constraints), then re-run the master and core seeders:
  - `npx sequelize-cli db:seed --seed 20251120102000-master-seeder.js`
  - `npx sequelize-cli db:seed --seed 20251120103000-core-entities-seeder.js`

---
