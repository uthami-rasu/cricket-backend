const repository = require("../repositories/samples.repository");
const Constant = require("../utils/constants");
const utils = require("../utils/utils");
const singularName = "sample";
const pluralName = "samples";

class Service {
  create = async (data) => {
    // do some validation like login if needed
    const result = utils.validateRequiredFields(
      data,
      Constant.SAMPLE_REQUIRED_FIELDS
    );
    if (result) {
      return { error: result };
    }
    const existing = await repository.getByName(data.name);
    if (existing) {
      return { error: "Duplicate record not allowed." };
    }
    return await repository.create(data);
  };

  getAll = async () => {
    return await repository.getAll();
  };

  getById = async (id) => {
    return await repository.getById(id);
  };

  update = async (id, data) => {
    // do some validation like login if needed
    return await repository.update(id, data);
  };

  delete = async (id) => {
    return await repository.delete(id);
  };
}

module.exports = new Service();
