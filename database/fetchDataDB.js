const { query } = require("./queryExecutor");
const fetchDataByKeyDb = async (key) => {
  return query(`SELECT * FROM DATA WHERE KEY = $1 `, [key]);
};
const fetchDataDb = async () => {
  return query(`SELECT * FROM DATA;`);
};

module.exports = { fetchDataByKeyDb, fetchDataDb };
