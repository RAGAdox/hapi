const { query } = require("./queryExecutor");
const insertDataDb = async (key, value) => {
  return query(`INSERT INTO DATA(key,value) VALUES ($1,$2)`, [key, value]);
};
const updateDataByKeyDb = async (key, value) => {
  return query(`UPDATE DATA SET VALUE=$2 WHERE KEY=$1 RETURNING *`, [
    key,
    value,
  ]);
};
const deleteDataByKeyDb = async (key) => {
  return query(`DELETE FROM DATA WHERE KEY=$1`, [key]);
};
module.exports = { insertDataDb, updateDataByKeyDb, deleteDataByKeyDb };
