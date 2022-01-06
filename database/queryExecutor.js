require("dotenv").config();
const { Pool } = require("pg");
const pool = new Pool();

module.exports = {
  query: async (text, params) => {
    return pool.query(text, params);
  },
};
