const service = require("../services/player.service");
const { success, error } = require("../responses/response");
const AppError = require("../responses/apperror");
const singularName = "player";
const pluralName = "players";

class Controller {
  create = async (req, res, next) => {
    try {
      const data = await service.create(req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data created successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:create: `, error);
    }
  };

  getAll = async (req, res, next) => {
    try {
      const data = await service.getAll();
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data retrieved successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:getAll: `, error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const data = await service.getById(req.params.id);
      if (data.error)
        throw new AppError({
          message: data.error,
          status: 404,
        });
      success(res, { message: "Data retrieved successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:getById: `, error);
    }
  };

  update = async (req, res, next) => {
    try {
      const data = await service.update(req.params.id, req.body);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data updated successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:update: `, error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const data = await service.delete(req.params.id);
      if (data.error)
        throw new AppError({
          message: data.error,
        });
      success(res, { message: "Data deleted successfully", data: data });
    } catch (error) {
      next(error);
      console.log(`${pluralName}:delete: `, error);
    }
  };
}

module.exports = new Controller();
