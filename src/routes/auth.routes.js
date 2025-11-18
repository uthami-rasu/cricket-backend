// routes/auth.routes.js
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const controller = require("../controllers/auth.controller");

router.post("/register", controller.create);
router.post("/login", controller.login);

module.exports = router;
