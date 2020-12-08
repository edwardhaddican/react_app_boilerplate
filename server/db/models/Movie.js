const Sequelize = require("sequelize");
const db = require("../db");

const Movie = db.define(
  "movie",
  {
    imdb_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    thumbsUp: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0,
      },
    },
    thumbsDown: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true,
        min: 0,
      },
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.TEXT,
    },
    year: {
      type: Sequelize.STRING,
    },
    genres: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
    directors: {
      type: Sequelize.ARRAY(Sequelize.STRING),
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["imdb_id"],
      },
    ],
  }
);

module.exports = Movie;
