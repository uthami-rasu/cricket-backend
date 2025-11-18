// routes/protected.routes.js
const express = require("express");
const router = express.Router();

const samplesRoutes = require("./samples.routes");
const roleRoutes = require("./roles.routes");
const permissionRoutes = require("./permissions.routes");
const userRoleRoutes = require("./userroles.routes");
const rolepermissionRoutes = require("./rolepermissions.routes");

// and all other routes to be protected should be brought here.. Eg. below.
// const plantRoutes = require('./plant.routes');
// router.use(express.json());
router.use("/samples", samplesRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/user-roles", userRoleRoutes);
router.use("/role-permissions", rolepermissionRoutes);

module.exports = router;
