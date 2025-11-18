const db = require("../models"); // Adjust path based on your project structure
const Model = db.User; // Access the model
const Util = require("../utils/utils");

const singlurName = "user";
const pluralName = "users";
class Repository {
  //All Repository's methods.. will return direct(whatever we need) data or {error: <message>}
  async create(data) {
    //beforeCreate hook will be fired defined in User Model file.
    //for hashing the password data.password was modified in hook in the model class.
    return await Model.create(data);
  }
  async login(data) {
    const { username, password } = data;

    const user = await Model.findOne({
      where: {
        username: username,
      },
    });
    if (!user) return { error: "User not found" };

    const passwordMatch = await Util.comparePassword(password, user.password);
    if (!passwordMatch) return { error: "Invalid password" }; // invalid credentials

    return { id: user.id, username: user.username };
  }

  async getUser(id) {
    const data = await Model.findByPk(id, {
      // subQuery: false, // Add this option - NO USE
      include: [
        {
          model: db.Role, // Include the Role model
          as: "roles", // Alias if defined in association
          through: { attributes: [] }, // Exclude join table attributes if not needed
          include: [
            {
              model: db.Permission, // Include the Permission model nested within Role
              as: "permissions", // Alias if defined in association
              through: { attributes: [] }, // Exclude join table attributes if not needed
            },
          ],
        },
      ],
    });
    if (!data) return { error: "User not found" };
    return data;
  }
  async getByUsername(username) {
    return await Model.findOne({ where: { username: username }, raw: true });
  }
}
module.exports = new Repository();
