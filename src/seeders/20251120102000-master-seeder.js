"use strict";
const { Op } = require("sequelize");
const Constant = require("../utils/constants");

const toTitleCase = (value) =>
  value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const withAuditColumns = (record) => ({
  ...record,
  is_active: record.is_active ?? true,
  created_at: record.created_at ?? new Date(),
  modified_at:
    Object.prototype.hasOwnProperty.call(record, "modified_at") &&
    record.modified_at !== undefined
      ? record.modified_at
      : null,
  created_by: record.created_by ?? 1,
  modified_by:
    Object.prototype.hasOwnProperty.call(record, "modified_by") &&
    record.modified_by !== undefined
      ? record.modified_by
      : null,
});

const buildRows = (codes, options = {}) => {
  const {
    labelMap = {},
    extraByCode = {},
    defaultRow = {},
    includeSort = true,
  } = options;
  return codes.map((code, index) => {
    const extras = extraByCode[code] || {};
    const row = {
      code,
      label: labelMap[code] ?? toTitleCase(code),
      ...defaultRow,
      ...extras,
    };
    if (includeSort && row.sort_order == null) {
      row.sort_order = index + 1;
    }
    return withAuditColumns(row);
  });
};

const PLAYER_POSITION_LABELS = {
  batting: "Batsman",
  bowling: "Bowler",
  all_rounder: "All Rounder",
};

const MATCH_STATUS_EXTRAS = {
  scheduled: { is_default: true },
};

const MASTER_SEEDS = [
  {
    table: "player_designations",
    uniqueKey: "code",
    rows: buildRows(Constant.player_designations.values),
  },
  {
    table: "player_batting_styles",
    uniqueKey: "code",
    rows: buildRows(Constant.player_batting_styles.values),
  },
  {
    table: "player_bowling_styles",
    uniqueKey: "code",
    rows: buildRows(Constant.player_bowling_styles.values),
  },
  {
    table: "player_bowling_types",
    uniqueKey: "code",
    rows: buildRows(Constant.player_bowling_types.values),
  },
  {
    table: "player_positions",
    uniqueKey: "code",
    rows: buildRows(Constant.player_positions.values, {
      labelMap: PLAYER_POSITION_LABELS,
    }),
  },
  {
    table: "match_statuses",
    uniqueKey: "code",
    rows: buildRows(Constant.match_status.values, {
      defaultRow: { category: "match", is_default: false },
      extraByCode: MATCH_STATUS_EXTRAS,
    }),
  },
  {
    table: "team_statuses",
    uniqueKey: "code",
    rows: buildRows(Constant.team_status.values),
  },
];

const ensureSeedData = async (queryInterface, { table, uniqueKey, rows }) => {
  for (const row of rows) {
    const where = { [uniqueKey]: row[uniqueKey] };
    const exists = await queryInterface.rawSelect(table, { where }, ["id"]);
    if (!exists) {
      await queryInterface.bulkInsert(table, [row]);
    }
  }
};

const removeSeedData = async (queryInterface, { table, uniqueKey, rows }) => {
  const valuesToDelete = rows.map((row) => row[uniqueKey]);
  await queryInterface.bulkDelete(table, {
    [uniqueKey]: { [Op.in]: valuesToDelete },
  });
};

module.exports = {
  async up(queryInterface) {
    for (const seedConfig of MASTER_SEEDS) {
      await ensureSeedData(queryInterface, seedConfig);
    }
  },

  async down(queryInterface) {
    for (const seedConfig of MASTER_SEEDS) {
      await removeSeedData(queryInterface, seedConfig);
    }
  },
};
