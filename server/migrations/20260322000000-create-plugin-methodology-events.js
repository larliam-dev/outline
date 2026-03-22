"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "plugin_methodology_events",
        {
          id: {
            type: Sequelize.UUID,
            allowNull: false,
            primaryKey: true,
          },
          event: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          data: {
            type: Sequelize.JSONB,
            allowNull: true,
          },
          teamId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: "teams", key: "id" },
            onDelete: "CASCADE",
          },
          userId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: "users", key: "id" },
            onDelete: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );

      await queryInterface.addIndex(
        "plugin_methodology_events",
        ["teamId", "event"],
        {
          name: "plugin_methodology_events_team_id_event",
          transaction,
        }
      );
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("plugin_methodology_events", {
        transaction,
      });
    });
  },
};
