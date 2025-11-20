# Enum Lookup Tables Plan

## Overview

All enumerations currently defined with `createEnum` in `src/utils/constants.js` will be normalized into dedicated database lookup tables. This ensures:

- Central administration of allowed values without redeploying code
- Consistent foreign key references across modules
- Traceability and metadata (display labels, ordering, activation windows)

## Normalization Strategy

1. **Master Lookup Tables**

   - Each enum gets its own table (e.g., `player_batting_styles`, `team_statuses`).
   - Tables expose at minimum `id`, `code`, and `label` columns.
   - Optional metadata: `description`, `is_active`, `sort_order`.
   - Audit columns (`created_at`, `created_by`, `modified_at`, `modified_by`) mirror existing patterns.

2. **Migration Approach**

   - Create Sequelize models + migrations for each lookup table.
   - Seed tables with existing enum values as baseline.
   - Update existing models to reference lookup tables via foreign keys instead of ENUM types.
   - Provide backward-compatible API responses (still return string codes).

3. **Access Pattern**
   - Controllers/services fetch lookup values via repositories or cached layers.
   - Front-end clients call new `/lookups/:type` endpoints to hydrate drop-downs.
   - Admin tooling can allow CRUD on lookup tables when required.

## Lookup Table Definitions

### 1. `player_designations`

- **Purpose**: Squad roles (captain, vice-captain, wicket keeper, regular player).
- **Referenced By**: `team_players.squad_role`.
- **Columns**:
  | Column | Type | Notes |
  | ------------- | --------- | --------------------------------------- |
  | `id` | PK | Auto-increment integer |
  | `code` | string | Unique code (e.g., `captain`) |
  | `label` | string | Display text (e.g., `Captain`) |
  | `description` | text | Optional, additional details |
  | `sort_order` | integer | Optional, default ordering |
  | `is_active` | boolean | Default `true` |
  | `created_at` | timestamp | Audit column |
  | `created_by` | string | Audit column |
  | `modified_at` | timestamp | Audit column |
  | `modified_by` | string | Audit column |

### 2. `player_batting_styles`

- **Purpose**: Batting handedness options.
- **Referenced By**: `players.batting_style`.
- **Schema**: Same structural columns as `player_designations`.

### 3. `player_bowling_styles`

- **Purpose**: Detailed bowling styles (e.g., right-arm fast).
- **Referenced By**: `players.bowling_style`.
- **Schema**: Same structural columns. `description` can clarify technique nuances.

### 4. `player_bowling_types`

- **Purpose**: Broad bowling categories (fast, medium, off-spin, leg-spin).
- **Referenced By**: Future analytics (currently unused but defined).
- **Schema**: Same structural columns. Consider `sort_order` to control UI grouping.

### 5. `player_positions`

- **Purpose**: Player primary roles (batting, bowling, all-rounder).
- **Referenced By**: `players.role` (rename to `position_id` during migration).
- **Schema**: Same structural columns.

### 6. `match_statuses`

- **Purpose**: Lifecycle of a match/season fixture (upcoming → completed).
- **Referenced By**: `seasons.status` (currently a match status enum proxy).
- **Schema Enhancements**:
  - Add `category` column to distinguish contexts (`match`, `season`) if reused.
  - Add `is_default` to mark `scheduled` for new seasons.

### 7. `team_statuses`

- **Purpose**: Operational status of teams.
- **Referenced By**: `teams.status`.
- **Schema**: Same structural columns.

## Migration Checklist

1. **Create migrations** for the lookup tables listed above.
2. **Seed initial data** using existing enum values.
3. **Alter existing tables**:
   - Replace ENUM columns with integer `*_id` foreign keys.
   - Ensure indexes on new foreign key columns.
4. **Update Sequelize models** to use associations (e.g., `Player.belongsTo(PlayerBattingStyle, ...)`).
5. **Adjust controllers/services** to map codes ↔ IDs during read/write operations.
6. **Add lookup endpoints** or reuse existing configuration APIs for UI consumption.
7. **Write regression tests** covering:
   - CRUD operations using lookup IDs
   - Seeding integrity (no duplicates)
   - API layer still returning human-readable codes.

## Decisions

1. **Table Strategy**: Keep individual domain tables (`player_batting_styles`, `team_statuses`, etc.). This avoids the overhead of a generic `enum_values` schema and aligns with developer-managed data.
2. **Localization**: Store a single `label` column for now. Additional locale columns can be introduced later if multilingual requirements emerge.
3. **Soft Deletes**: Use an `is_active` boolean to deactivate values without removing history; avoid hard deletes to protect referential integrity.
4. **Management Model**: Lookup values remain developer-controlled via migrations/seed scripts. No admin-facing CRUD endpoints are planned.

These choices finalize the migration plan; implementation can proceed following the checklist above.
