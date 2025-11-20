"use strict";
const { Op } = require("sequelize");
const Constant = require("../utils/constants");

const withAuditColumns = (record) => ({
  created_at: new Date(),
  modified_at: null,
  created_by: "system",
  modified_by: null,
  ...record,
});

const PLAYER_SEEDS = [
  {
    first_name: "Virat",
    last_name: "Kohli",
    full_name: "Virat Kohli",
    date_of_birth: "1988-11-05",
    nationality: "India",
    batting_style_code: Constant.player_batting_styles.RIGHT_HANDED,
    bowling_style_code: Constant.player_bowling_styles.RIGHT_ARM_MEDIUM,
    position_code: Constant.player_positions.BATTING,
  },
  {
    first_name: "Faf",
    last_name: "du Plessis",
    full_name: "Faf du Plessis",
    date_of_birth: "1984-07-13",
    nationality: "South Africa",
    batting_style_code: Constant.player_batting_styles.RIGHT_HANDED,
    bowling_style_code: Constant.player_bowling_styles.RIGHT_ARM_LEG_SPIN,
    position_code: Constant.player_positions.BATTING,
  },
  {
    first_name: "Ravindra",
    last_name: "Jadeja",
    full_name: "Ravindra Jadeja",
    date_of_birth: "1988-12-06",
    nationality: "India",
    batting_style_code: Constant.player_batting_styles.LEFT_HANDED,
    bowling_style_code: Constant.player_bowling_styles.LEFT_ARM_OFF_SPIN,
    position_code: Constant.player_positions.ALL_ROUNDER,
  },
  {
    first_name: "MS",
    last_name: "Dhoni",
    full_name: "MS Dhoni",
    date_of_birth: "1981-07-07",
    nationality: "India",
    batting_style_code: Constant.player_batting_styles.RIGHT_HANDED,
    bowling_style_code: Constant.player_bowling_styles.RIGHT_ARM_MEDIUM,
    position_code: Constant.player_positions.BATTING,
  },
];

const TEAM_SEEDS = [
  {
    name: "Royal Challengers Bengaluru",
    short_name: "RCB",
    home_city: "Bengaluru",
    coach_name: "Andy Flower",
    home_ground: "M. Chinnaswamy Stadium",
    year_founded: 2008,
    status_code: Constant.team_status.ACTIVE,
  },
  {
    name: "Chennai Super Kings",
    short_name: "CSK",
    home_city: "Chennai",
    coach_name: "Stephen Fleming",
    home_ground: "M. A. Chidambaram Stadium",
    year_founded: 2008,
    status_code: Constant.team_status.ACTIVE,
  },
];

const SEASON_SEEDS = [
  {
    year: 2024,
    name: "IPL 2024",
    start_date: "2024-03-22",
    end_date: "2024-05-26",
    status: Constant.match_status.COMPLETED,
  },
  {
    year: 2025,
    name: "IPL 2025",
    start_date: "2025-03-20",
    end_date: null,
    status: Constant.match_status.SCHEDULED,
  },
];

const TEAM_PLAYER_ASSIGNMENTS = [
  {
    teamShortName: "RCB",
    playerFullName: "Virat Kohli",
    seasonYear: 2024,
    squad_role_code: Constant.player_designations.CAPTAIN,
    jersey_number: 18,
  },
  {
    teamShortName: "RCB",
    playerFullName: "Faf du Plessis",
    seasonYear: 2024,
    squad_role_code: Constant.player_designations.VICE_CAPTAIN,
    jersey_number: 13,
  },
  {
    teamShortName: "CSK",
    playerFullName: "MS Dhoni",
    seasonYear: 2024,
    squad_role_code: Constant.player_designations.CAPTAIN,
    jersey_number: 7,
  },
  {
    teamShortName: "CSK",
    playerFullName: "Ravindra Jadeja",
    seasonYear: 2024,
    squad_role_code: Constant.player_designations.REGULAR_PLAYER,
    jersey_number: 8,
  },
  {
    teamShortName: "CSK",
    playerFullName: "MS Dhoni",
    seasonYear: 2025,
    squad_role_code: Constant.player_designations.CAPTAIN,
    jersey_number: 7,
  },
];

const createLookupResolver = (queryInterface) => {
  const cache = {};
  return async (table, code, field = "code") => {
    if (!code) {
      return null;
    }

    cache[table] ??= {};
    if (cache[table][code]) {
      return cache[table][code];
    }

    const id = await queryInterface.rawSelect(
      table,
      { where: { [field]: code } },
      ["id"]
    );

    if (!id) {
      throw new Error(
        `Missing lookup value "${code}" in table ${table}. Ensure master seeds ran first.`
      );
    }

    cache[table][code] = id;
    return id;
  };
};

const ensureRecord = async (queryInterface, table, uniqueWhere, record) => {
  const existingId = await queryInterface.rawSelect(
    table,
    { where: uniqueWhere },
    ["id"]
  );
  if (existingId) {
    return existingId;
  }
  await queryInterface.bulkInsert(table, [withAuditColumns(record)]);
  return await queryInterface.rawSelect(table, { where: uniqueWhere }, ["id"]);
};

module.exports = {
  async up(queryInterface) {
    const resolveLookupId = createLookupResolver(queryInterface);

    const playerIds = {};
    for (const player of PLAYER_SEEDS) {
      const playerRecord = {
        first_name: player.first_name,
        last_name: player.last_name,
        full_name: player.full_name,
        date_of_birth: player.date_of_birth,
        nationality: player.nationality,
        image_url: player.image_url ?? null,
        batting_style_id: await resolveLookupId(
          "player_batting_styles",
          player.batting_style_code
        ),
        bowling_style_id: await resolveLookupId(
          "player_bowling_styles",
          player.bowling_style_code
        ),
        position_id: await resolveLookupId(
          "player_positions",
          player.position_code
        ),
      };

      const id = await ensureRecord(
        queryInterface,
        "players",
        { full_name: player.full_name },
        playerRecord
      );
      playerIds[player.full_name] = id;
    }

    const teamIds = {};
    for (const team of TEAM_SEEDS) {
      const teamRecord = {
        name: team.name,
        short_name: team.short_name,
        home_city: team.home_city,
        coach_name: team.coach_name,
        home_ground: team.home_ground,
        year_founded: team.year_founded,
        status_id: await resolveLookupId("team_statuses", team.status_code),
      };

      const id = await ensureRecord(
        queryInterface,
        "teams",
        { short_name: team.short_name },
        teamRecord
      );
      teamIds[team.short_name] = id;
    }

    const seasonIds = {};
    for (const season of SEASON_SEEDS) {
      const id = await ensureRecord(
        queryInterface,
        "seasons",
        { year: season.year },
        season
      );
      seasonIds[season.year] = id;
    }

    for (const assignment of TEAM_PLAYER_ASSIGNMENTS) {
      const teamId = teamIds[assignment.teamShortName];
      const playerId = playerIds[assignment.playerFullName];
      const seasonId = seasonIds[assignment.seasonYear];

      if (!teamId || !playerId || !seasonId) {
        continue;
      }

      const squadRoleId = await resolveLookupId(
        "player_designations",
        assignment.squad_role_code
      );

      await ensureRecord(
        queryInterface,
        "team_players",
        {
          team_id: teamId,
          player_id: playerId,
          season_id: seasonId,
        },
        {
          team_id: teamId,
          player_id: playerId,
          season_id: seasonId,
          squad_role_id: squadRoleId,
          jersey_number: assignment.jersey_number,
          is_active: true,
        }
      );
    }
  },

  async down(queryInterface) {
    for (const assignment of TEAM_PLAYER_ASSIGNMENTS) {
      const teamId = await queryInterface.rawSelect(
        "teams",
        { where: { short_name: assignment.teamShortName } },
        ["id"]
      );
      const playerId = await queryInterface.rawSelect(
        "players",
        { where: { full_name: assignment.playerFullName } },
        ["id"]
      );
      const seasonId = await queryInterface.rawSelect(
        "seasons",
        { where: { year: assignment.seasonYear } },
        ["id"]
      );

      if (teamId && playerId && seasonId) {
        await queryInterface.bulkDelete(
          "team_players",
          {
            team_id: teamId,
            player_id: playerId,
            season_id: seasonId,
          },
          {}
        );
      }
    }

    await queryInterface.bulkDelete(
      "team_players",
      {
        season_id: {
          [Op.is]: null,
        },
      },
      {}
    );

    await queryInterface.bulkDelete(
      "players",
      {
        full_name: {
          [Op.in]: PLAYER_SEEDS.map((p) => p.full_name),
        },
      },
      {}
    );

    await queryInterface.bulkDelete(
      "teams",
      {
        short_name: {
          [Op.in]: TEAM_SEEDS.map((t) => t.short_name),
        },
      },
      {}
    );

    await queryInterface.bulkDelete(
      "seasons",
      {
        year: {
          [Op.in]: SEASON_SEEDS.map((s) => s.year),
        },
      },
      {}
    );
  },
};
