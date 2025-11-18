const utils = require("../utils/utils");
const Constant = require("../utils/constants");
const db = require("../models"); // Adjust path based on your project structure
const Model = db.Sample; // Access the model
const Ordermodel = db.Order;
const singularName = "sample";
const pluralName = "samples";

class Repository {
  // Add more CRUD operations as needed
  async create(data) {
    const created = await Model.create(data, { raw: true });
    if (!created) {
      return { error: `Data creation failed` };
    }
    return created;
  }

  async getAll() {
    return await Model.findAll({ raw: true });
  }

  async getById(id) {
    const data = await Model.findByPk(id, { raw: true });
    if (!data) {
      return { error: `Data not found` };
    }
    return data;
  }

  async update(id, data) {
    const [updatedRows] = await Model.update(data, {
      where: { id: id },
    });
    if (!updatedRows) {
      return { error: `Data not found` };
    }
    return await Model.findByPk(id, { raw: true });
  }

  async delete(id) {
    const deleted = Model.destroy({
      where: { id: id },
    });
    if (!deleted) {
      return { error: "Delete failed." };
    }
    return deleted;
  }

  async getByName(name) {
    return await Model.findOne({ where: { name: name }, raw: true });
  }
}
module.exports = new Repository();
