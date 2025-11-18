const jwt = require("jsonwebtoken");
const repository = require("../repositories/auth.repository");
const db = require("../models"); //using sequelize orm models.
const Util = require("../utils/utils");
const { DEFAULT_PLANT } = require("../utils/constants");
const AppError = require("../responses/apperror");

class Service {
  //All Service's methods.. will return direct(whatever we need) data or {error: <message>}
  // async getAll() {
  //   return await repository.getAll();
  // }

  // async getById(id) {
  //   return await repository.getById(id);
  // }

  async create(data) {
    const existing = await repository.getByUsername(data.username);
    if (existing) {
      return { error: "User already exists." };
    }
    return await repository.create(data);
  }

  async login(reqData) {
    //maybe validation logic codes comes here.
    if (!reqData || !reqData.username || !reqData.password) {
      return { error: "Enter valid credentials" };
    }
    const data = await repository.login(reqData);

    if (data.error) {
      return data;
    }
    const user = data;
    // JWT token
    const userPayload = { id: user.id, username: user.username };
    const token = await Util.generateToken(userPayload);

    // Roles & permissions
    const { roles, permissions } =
      await this.getUserRolesAndPermissionsSequelize(user.id);
    user.roles = roles;
    user.permissions = permissions;

    return { user, token }; // Standardized data
  }

  async getUserRolesAndPermissionsSequelize(id) {
    const user = await repository.getUser(id);
    if (!user) {
      return { error: "User not found" };
    }
    // Extract roles and permissions
    const roles = user.roles.map((role) => role.name); // Assuming 'name' field for role
    const allPermissions = user.roles.flatMap(
      (role) =>
        role.permissions
          ? role.permissions.map((permission) => permission.name)
          : [] // Assuming 'name' field for permission
    );
    // Remove duplicates by creating a Set and converting it back to an array
    // const uniquePermissions = [...new Set(permissions)];
    //OR
    // Use reduce to create an array with unique permissions
    const permissions = allPermissions.reduce((unique, item) => {
      return unique.includes(item) ? unique : [...unique, item];
    }, []);
    return { roles, permissions };
  }
  // Add more business logic methods
}

module.exports = new Service();
