const { Op, fn, col, where, literal, Sequelize } = require("sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Constant = require("./constants");
const dayjs = require("./dayjsConfig");
const ACCESS_TOKEN_SECRET =
  "31b6ac46c98cead6563a8b392d020177bf1d52d9b33c8071156c5105e967c8d6";
const ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7;
const REFRESH_TOKEN_EXPIRE_DAYS = 7;
class Util {
  // Hashing a password
  async hashPassword(password) {
    try {
      const saltRounds = Constant.saltRounds; // Or generate salt explicitly: const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(String(password), saltRounds); // Using saltRounds for automatic salt generation
      return hashedPassword;
    } catch (error) {
      console.error("Error hashing password:", error);
      throw error;
    }
  }

  // Comparing a password
  async comparePassword(plaintextPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plaintextPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error("Error comparing passwords:", error);
      throw error;
    }
  }
  async verifyJwtToken(token, callback) {
    jwt.verify(token, ACCESS_TOKEN_SECRET, callback);
  }

  async generateToken(userPayload) {
    // Generate JWT with strong security practices
    // for secret_key generation to store .env file
    // run require("crypto").randomBytes(32).toString("hex") in 'node prompt'
    const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, {
      expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}m`,
    });
    const refreshToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, {
      expiresIn: `${REFRESH_TOKEN_EXPIRE_DAYS}d`,
    });
    return { accessToken, refreshToken };
  }
  isValidDate(date) {
    return date && !isNaN(new Date(date).getTime());
  }
  formatNum = (val, rndOff) =>
    val != null ? Number(val).toFixed(rndOff) : (0).toFixed(rndOff);
  normalizeKeysToLowerCase = (obj, exclude = []) => {
    const result = {};
    const excludeLower = exclude.map((e) => e.toLowerCase());
    for (const [key, value] of Object.entries(obj)) {
      if (excludeLower.includes(key.toLowerCase())) {
        // Keep excluded keys as they are
        result[key] = value;
      } else {
        // Normalize all other keys to lowercase
        result[key.toLowerCase()] = value;
      }
    }
    return result;
  };
  sanitizeEmptyStrings = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string") {
        const trimmed = value.trim();
        sanitized[key] = trimmed === "" ? null : trimmed;
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  };
  convertToUTC = (inDate) => {
    let dt = dayjs(inDate);
    // Convert to given timezone
    dt = dt.tz(Constant.DEFAULT_TIMEZONE);
    // Convert to UTC string for DB
    const dt_utc = dt.utc().format(Constant.DEFAULT_DATE_FORMAT_DB);
    return dt_utc;
  };
  getStartOfWeekUtc = (dateStr = null) => {
    const local = dayjs.tz(dateStr || dayjs(), Constant.DEFAULT_TIMEZONE);
    // Monday as start (that .add(1, day))
    return local
      .startOf(Constant.WEEK)
      .add(1, Constant.DAY)
      .utc()
      .format(Constant.DEFAULT_DATE_FORMAT_DB);
  };
  // Get start of the day in UTC string format for DB
  getStartOfTheDayUtc = (dateStr = null, applyToday = false) => {
    if (!dateStr && !applyToday) return null;
    if (!dateStr && applyToday) {
      dateStr = dayjs();
    }
    const local = dayjs.tz(
      dateStr,
      Constant.DEFAULT_DATE_FORMAT,
      Constant.DEFAULT_TIMEZONE
    );
    return local
      .startOf(Constant.DAY)
      .utc()
      .format(Constant.DEFAULT_DATE_FORMAT_DB);
  };

  // Get end of the day in UTC string format for DB
  getEndOfTheDayUtc = (dateStr = null, applyToday = false) => {
    if (!dateStr && !applyToday) return null;
    if (!dateStr && applyToday) {
      dateStr = dayjs();
    }
    const local = dayjs.tz(
      dateStr,
      Constant.DEFAULT_DATE_FORMAT,
      Constant.DEFAULT_TIMEZONE
    );
    return local
      .endOf(Constant.DAY)
      .utc()
      .format(Constant.DEFAULT_DATE_FORMAT_DB);
  };
  extractTimeString_0 = (timeStr) => {
    // timeStr can be <empty> or '02:05:28 AM/PM' or '1899-12-30 02:05:28 AM/PM' or '02:05:28' or '2:5:1' or '1899-12-30 02:05:28'
    let hhmmss = Constant.ZERO_TIME;
    if (!timeStr) {
      return hhmmss;
    }
    const parts = timeStr.trim().split(" ");
    if (
      timeStr.trim().toLowerCase().endsWith("am") ||
      timeStr.trim().toLowerCase().endsWith("pm")
    ) {
      if (parts.length == 2) {
        hhmmss = parts[0];
      } else if (parts.length == 3) {
        hhmmss = parts[1];
      }
    } else {
      if (parts.length == 1) {
        hhmmss = parts[0];
      } else {
        hhmmss = parts[1];
      }
    }
    return hhmmss;
  };
  extractTimeString = (timeStr) => {
    // Handles:
    // "", "02:05:28 AM", "1899-12-30 02:05:28 AM", "02:05:28", "2:5:1", "1899-12-30 02:05:28"
    const ZERO_TIME = Constant.ZERO_TIME;

    if (!timeStr || typeof timeStr !== "string") return ZERO_TIME;

    const trimmed = timeStr.trim();

    // Regex explanation:
    // - Optional date part: \d{4}-\d{2}-\d{2}\s*  (e.g., "1899-12-30 ")
    // - Capture group for time: (\d{1,2}:\d{1,2}:\d{1,2})
    // - Optional space + AM/PM (case-insensitive)
    // - Capture group for AM/PM: ([AaPp][Mm])
    const match = trimmed.match(
      /(?:\d{4}-\d{2}-\d{2}\s*)?(\d{1,2}:\d{1,2}:\d{1,2})(?:\s*([AaPp][Mm]))?$/
    );
    if (!match) return ZERO_TIME;

    let [_, timePart, ampm] = match;
    let [hh, mm, ss] = timePart.split(":").map((n) => parseInt(n, 10));

    // Convert to 24-hour format if AM/PM present
    if (ampm) {
      const isPM = ampm.toLowerCase() === "pm";
      if (isPM && hh < 12) hh += 12;
      if (!isPM && hh === 12) hh = 0;
    }

    // Always return HH:mm:ss (zero-padded)
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(hh)}:${pad(mm)}:${pad(ss)}`;
  };

  // Merge date + time first, then convert to UTC
  mergeDateTimeToUTC = (
    dateStr,
    timeStr,
    formatStr = Constant.DEFAULT_DATE_FORMAT_REQUEST
  ) => {
    if (!dateStr) return null;
    console.log(dateStr, timeStr);
    const hhmmss = this.extractTimeString(timeStr);
    console.log("only time: ", hhmmss);
    // Detect format of dateStr and normalize
    let dateFormat = formatStr;
    if (dateStr.includes("-") && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      // e.g. 2025-10-23
      dateFormat = Constant.DEFAULT_DATE_FORMAT_DB;
    }
    console.log("format string : ", dateFormat);
    const local = dayjs.tz(
      `${dateStr} ${hhmmss}`,
      dateFormat,
      Constant.DEFAULT_TIMEZONE
    );
    //DONT sent UTC string for saving db to sequelize. Always send JS Date of UTC instant....
    return local.utc().toDate(); // <-- JS Date (UTC instant)
  };
  getClientCondition = async (user, aliasName = null) => {
    const db = require("../models"); // Adjust path based on your project structure
    const ClientSiteModel = db.ClientSite;
    const ClientUserModel = db.ClientUser;
    let clientCodeCondition = {}; // default: no filter
    if (!Constant.isClient(user)) {
      return clientCodeCondition;
    }

    // Fetch all client sites linked to this user
    const clientSites = await ClientSiteModel.findAll({
      include: [
        {
          model: ClientUserModel,
          as: "client_users", // must match association name
          where: { user_id: user.id },
          attributes: [],
        },
      ],
      attributes: ["clientcode_1"],
      raw: true,
    });
    console.log("KKK:", clientSites);
    const clientCodes = clientSites.map((s) => s.clientcode_1).filter(Boolean);

    if (clientCodes.length > 0) {
      // Use alias if provided
      const key = aliasName ? `$${aliasName}.clientcode_1$` : "clientcode_1";
      clientCodeCondition[key] = { [Op.in]: clientCodes };
    }
    console.log("cc:", clientCodeCondition);
    return clientCodeCondition;
  };
  parseAsUtcDateOnly = (dateString) => {
    if (!dateString) return null;
    // accept "YYYY-MM-DD" or Date object
    if (dateString instanceof Date)
      return new Date(
        dateString.getFullYear(),
        dateString.getMonth(),
        dateString.getDate()
      );
    const parts = dateString.split("-");
    if (parts.length !== 3) return null;
    const [y, m, d] = parts.map((p) => parseInt(p, 10));
    if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
    // Note: months are 0-indexed for numeric Date constructor
    return new Date(y, m - 1, d);
  };
  parseAsUTC = (dateString) => {
    if (!dateString) return null;

    if (dateString instanceof Date) return new Date(dateString);

    // Split date and time
    const [datePart, timePart] = dateString.split(" ");

    const dateParts = datePart.split("-");
    if (dateParts.length !== 3) return null;

    const [y, m, d] = dateParts.map((p) => parseInt(p, 10));
    if ([y, m, d].some((v) => Number.isNaN(v))) return null;

    let h = 0,
      min = 0,
      s = 0;

    if (timePart) {
      const timeParts = timePart.split(":");
      if (timeParts.length >= 1) h = parseInt(timeParts[0], 10) || 0;
      if (timeParts.length >= 2) min = parseInt(timeParts[1], 10) || 0;
      if (timeParts.length >= 3) s = parseInt(timeParts[2], 10) || 0;
    }

    // Return local date with full time
    // return new Date(y, m - 1, d, h, min, s);
    return new Date(Date.UTC(y, m - 1, d, h, min, s));
  };
  isValidDate(date) {
    return date && !isNaN(new Date(date).getTime());
  }

  getDateFilter = async (
    user,
    startDate = null,
    endDate = null,
    fieldMap = null,
    aliasName = null,
    isIncludeClientCondition = true
  ) => {
    console.log("st dt given: ", startDate);
    console.log("ed dt given: ", endDate);
    const dayBegin = this.getStartOfTheDayUtc(startDate);
    const dayEnd = this.getEndOfTheDayUtc(endDate);
    console.log("day begin: ", dayBegin);
    console.log("day end: ", dayEnd);

    const dateColumn = fieldMap?.date || "date_1";
    const dateFilter = {};
    const dtColPath = aliasName ? `$${aliasName}.${dateColumn}$` : dateColumn;
    if (startDate && endDate) {
      dateFilter[dtColPath] = {
        // dayBegin, dayEnd  is already UTC , so block sequelize from apply offset again. use literal()
        [Op.gte]: literal(`'${dayBegin}'`),
        [Op.lte]: literal(`'${dayEnd}'`),
      };
    } else if (startDate)
      dateFilter[dtColPath] = { [Op.gte]: literal(`'${dayBegin}'`) };
    else if (endDate)
      dateFilter[dtColPath] = { [Op.lt]: literal(`'${dayEnd}'`) };

    if (isIncludeClientCondition) {
      // Use getClientCondition() to dynamically get clientcode_1 condition
      const clientCodeCondition = await this.getClientCondition(
        user,
        aliasName
      );

      // Merge the client condition into the dateFilter
      Object.assign(dateFilter, clientCodeCondition);
    }
    return dateFilter;
  };
  checkDates = (fromDate, toDate) => {
    const start = fromDate?.trim() || null;
    const end = toDate?.trim() || null;

    if (
      (start && !this.isValidDate(start)) ||
      (end && !this.isValidDate(end))
    ) {
      throw new Error("Give some valid dates...");
    }
    return { start, end };
  };
  roundOffFields = (data, fields_to_format = [], decimalPlaces = 2) => {
    // Handle both single object or array of objects
    const formatRecord = (record) => {
      if (!record) return record;
      const formatted = { ...record };
      for (const field of fields_to_format) {
        if (formatted[field] !== null && formatted[field] !== undefined) {
          const val = parseFloat(formatted[field]);
          // keep as string so "1.20" is preserved
          formatted[field] = isNaN(val) ? null : val.toFixed(decimalPlaces);
          // formatted[field] = isNaN(val) ? null : Number(val.toFixed(decimalPlaces));
        }
      }
      return formatted;
    };

    if (Array.isArray(data)) {
      return data.map(formatRecord);
    } else {
      return formatRecord(data);
    }
  };
  validateRequiredFields = (data, reqFields) => {
    if (!data) return `Data is empty`;
    const missing = reqFields.filter(
      (field) =>
        data[field] === undefined ||
        data[field] === null ||
        data[field].toString().trim() === ""
    );
    if (missing.length > 0) {
      return `Missing required fields: ${missing.join(", ")}`;
    }
    return null;
  };
}

module.exports = new Util();
