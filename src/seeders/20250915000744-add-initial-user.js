"use strict";
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash("1234", 10);

    // Check if any users exist
    const usersCount = await queryInterface.rawSelect(
      "users",
      {
        attributes: [[Sequelize.fn("COUNT", Sequelize.col("id")), "count"]],
      },
      "count"
    );

    if (usersCount && usersCount > 0) {
      console.log("Data already exist — users/roles/user_roles - skipping.");
      return;
    }

    // Users
    const users = [
      { username: "admin", email: "admin@example.com" },
      { username: "gsm", email: "gsmmgsm@gmail.com" },
      { username: "user1", email: "user1@example.com" },
    ];

    for (const u of users) {
      await queryInterface
        .rawSelect(
          "users",
          {
            where: {
              [Op.or]: [{ username: u.username }, { email: u.email }],
            },
          },
          ["id"]
        )
        .then(async (exists) => {
          if (!exists) {
            await queryInterface.bulkInsert("users", [
              {
                username: u.username,
                email: u.email,
                password: hash,
                created_at: new Date(),
                modified_at: null,
                created_by: 1,
                modified_by: null,
              },
            ]);
          }
        });
    }

    // Roles
    const roles = [
      {
        name: "Super Admin",
        desc: "Full access to manage cricket platform content",
      },
      {
        name: "Editor",
        desc: "Creates cricket updates requiring approval",
      },
    ];

    for (const r of roles) {
      await queryInterface
        .rawSelect("roles", { where: { name: r.name } }, ["id"])
        .then(async (exists) => {
          if (!exists) {
            await queryInterface.bulkInsert("roles", [
              {
                name: r.name,
                desc: r.desc,
                created_at: new Date(),
                modified_at: null,
                created_by: 1,
                modified_by: null,
              },
            ]);
          }
        });
    }

    // User roles
    // Permissions aligned with cricket workflow
    const permissions = [
      { name: "manage_scores", desc: "Upload and edit match scores" },
      { name: "manage_posts", desc: "Create and edit posts/photos/updates" },
      { name: "approve_content", desc: "Approve or reject submitted content" },
    ];

    for (const p of permissions) {
      await queryInterface
        .rawSelect("permissions", { where: { name: p.name } }, ["id"])
        .then(async (exists) => {
          if (!exists) {
            await queryInterface.bulkInsert("permissions", [
              {
                name: p.name,
                desc: p.desc,
                created_at: new Date(),
                modified_at: null,
                created_by: 1,
                modified_by: null,
              },
            ]);
          }
        });
    }

    const rolePermissions = [
      { role: "Super Admin", permission: "manage_scores" },
      { role: "Super Admin", permission: "manage_posts" },
      { role: "Super Admin", permission: "approve_content" },
      { role: "Editor", permission: "manage_scores" },
      { role: "Editor", permission: "manage_posts" },
    ];

    for (const rp of rolePermissions) {
      const roleId = await queryInterface.rawSelect(
        "roles",
        { where: { name: rp.role } },
        ["id"]
      );
      const permissionId = await queryInterface.rawSelect(
        "permissions",
        { where: { name: rp.permission } },
        ["id"]
      );

      if (!roleId || !permissionId) {
        continue;
      }

      const exists = await queryInterface.rawSelect(
        "role_permissions",
        { where: { role_id: roleId, permission_id: permissionId } },
        ["id"]
      );

      if (!exists) {
        await queryInterface.bulkInsert("role_permissions", [
          {
            role_id: roleId,
            permission_id: permissionId,
            created_at: new Date(),
            modified_at: null,
            created_by: 1,
            modified_by: null,
          },
        ]);
      }
    }

    const userRoles = [
      { username: "admin", role: "Super Admin" },
      { username: "gsm", role: "Super Admin" },
      { username: "user1", role: "Editor" },
    ];

    for (const ur of userRoles) {
      const userId = await queryInterface.rawSelect(
        "users",
        { where: { username: ur.username } },
        ["id"]
      );
      const roleId = await queryInterface.rawSelect(
        "roles",
        { where: { name: ur.role } },
        ["id"]
      );

      const exists = await queryInterface.rawSelect(
        "user_roles",
        { where: { user_id: userId, role_id: roleId } },
        ["id"]
      );

      if (!exists) {
        await queryInterface.bulkInsert("user_roles", [
          {
            user_id: userId,
            role_id: roleId,
            created_at: new Date(),
            modified_at: null,
            created_by: 1,
            modified_by: null,
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    // Optional: you can leave as-is, or remove truncate if you don’t want to wipe
  },
};
