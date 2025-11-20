const path = require("path");
const { createEnum } = require("./utils");

class Constant {
  API_DOCS_FILE = path.join(__dirname, "../routes/", "API_DOCS.md");
  // date and time related starts
  time_formats = {
    time24Full: "HH:mm:ss",
    time12Full: "hh:mm:ss",
    time24: "HH:mm",
    time12: "hh:mm",
    time12M: "hh:mm A",
    time12FullWithAMPM: "hh:mm:ss A",
  };
  // for dayjs - format strings.. starts
  date_formats = {
    // for using in dayjs formats...
    DDMMYYYYHHmmss: "DD-MM-YYYY HH:mm:ss",
    DDMMMYYYY: "DD-MMM-YYYY",
    DDMMMYYYYHHmmss: "DD-MMM-YYYY HH:mm:ss",
    DDMMMYYYYYhhmmssa: "DD-MMM-YYYY hh:mm:ss A",

    YYYYMMDD: "YYYY-MM-DD",
    YYYYMMDDhhmmssa: "YYYY-MM-DD hh:mm:ss A",
    YYYYMMDDTHHmmssZ: "YYYY-MM-DDTHH:mm:ssZ",

    YYYYMMDDHHmmss: "YYYY-MM-DD HH:mm:ss", // for DB

    // for native JS formatting if needed starts eg. react-datepicker's dateFormat's value is this , not the above dayjs format
    ddMMMyyyy: "dd-MMM-yyyy", //
    ddMMMyyyyHHmmss: "dd-MMM-yyyy HH:mm:ss",
    ddMMMyyyyhhmmssa: "dd-MMM-yyyy hh:mm:ss A",

    yyyyMMdd: "yyyy-MM-dd", //
    yyyyMMddhhmmssa: "yyyy-MM-dd hh:mm:ss A",
    yyyyMMddTHHmmssZ: "yyyy-MM-ddTHH:mm:ssZ",

    MMddMMyyyy: "MM-dd-yyyy",
    MMMd: "MMM D",
    MMMdyyyy: "MMM D, YYYY",
    // for native JS formatting if needed ends
  };
  // for dayjs - format strings.. ends
  DEFAULT_TIMEZONE = "Asia/Riyadh";
  DEFAULT_DATE_FORMAT_JS = this.date_formats.ddMMMyyyy; //for native JS formatting like in datepicker
  DEFAULT_DATE_FORMAT = this.date_formats.DDMMMYYYY; // dayjs formatting... for display
  DEFAULT_DATE_FORMAT_FULL = this.date_formats.DDMMMYYYYHHmmss; // dayjs formatting... for display
  DEFAULT_DATE_FORMAT_REQUEST = this.date_formats.DDMMMYYYYHHmmss; // sent in request....
  DEFAULT_DATE_FORMAT_DB = this.date_formats.YYYYMMDDHHmmss; // DB formatting... UTC full
  DAY = "day";
  TODAY = "today";
  YESTERDAY = "yesterday";
  WEEK = "week";
  ZERO_TIME = "00:00:00";
  ALL = "all";

  // date and time related ends
  whiteList = ["/api/auth/login", "/api/auth/register"];
  saltRounds = 10;

  roles = Object.freeze({
    ADMIN: "admin",
    OPERATOR: "operator",
    CLIENT: "client",
  });

  player_designations = createEnum({
    CAPTAIN: "captain",
    VICE_CAPTAIN: "vice_captain",
    WICKET_KEEPER: "wicket_keeper",
    REGULAR_PLAYER: "regular_player",
  });

  player_batting_styles = createEnum({
    RIGHT_HANDED: "right_handed",
    LEFT_HANDED: "left_handed",
  });

  player_bowling_styles = createEnum({
    RIGHT_ARM_FAST: "right_arm_fast",
    LEFT_ARM_FAST: "left_arm_fast",
    RIGHT_ARM_MEDIUM: "right_arm_medium",
    LEFT_ARM_MEDIUM: "left_arm_medium",
    RIGHT_ARM_OFF_SPIN: "right_arm_off_spin",
    LEFT_ARM_OFF_SPIN: "left_arm_off_spin",
    RIGHT_ARM_LEG_SPIN: "right_arm_leg_spin",
    LEFT_ARM_LEG_SPIN: "left_arm_leg_spin",
  });

  player_bowling_types = createEnum({
    FAST: "fast",
    MEDIUM: "medium",
    OFF_SPIN: "off_spin",
    LEG_SPIN: "leg_spin",
  });

  player_positions = createEnum({
    BATTING: "batting",
    BOWLING: "bowling",
    ALL_ROUNDER: "all_rounder",
  });

  match_status = createEnum({
    UPCOMING: "upcoming",
    SCHEDULED: "scheduled",
    STARTED: "started",
    DELAYED: "delayed",
    STOPPED: "stopped",
    LIVE: "live",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  });

  team_status = createEnum({
    ACTIVE: "active",
    INACTIVE: "inactive",
    SUSPENDED: "suspended",
  });

  isClient = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.CLIENT.toLowerCase()
    );
  isOperator = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.OPERATOR.toLowerCase()
    );
  isAdmin = (user) =>
    user?.roles?.some(
      (r) => r.toLowerCase() === this.roles.ADMIN.toLowerCase()
    );

  created_at = "created_at";
  modified_at = "modified_at";
  beforeCreate = "beforeCreate";
  afterCreate = "afterCreate";
  beforeUpdate = "beforeUpdate";

  SAMPLE_REQUIRED_FIELDS = ["name"];
}
module.exports = new Constant();
