//Redis Methods to save and update cache
const { redisGetData, redisSetData, redisDelData } = require("../redis");
//Database Methods to fetch data from database if data not present in cache
const { fetchDataByKeyDb, fetchDataDb } = require("../database/fetchDataDB");
//Database Methods to save data into database
const {
  insertDataDb,
  updateDataByKeyDb,
  deleteDataByKeyDb,
} = require("../database/saveDataDB");

//Controller Functions to perform CRUD Operations

const getDataByKey = async (request, h) => {
  const key = request.query.key;
  let data = await redisGetData(key);
  if (data !== null) {
    return h.response({ key: key, value: data });
  } else {
    try {
      const result = await fetchDataByKeyDb(key);
      if (result.rowCount != 0) {
        await redisSetData(result.rows[0].key, result.rows[0].value);
        return h.response(result.rows[0]);
      } else
        return h
          .response({
            success: false,
            message: `Key doesnot exists in database`,
          })
          .code(404);
    } catch (error) {
      return h
        .response({
          success: false,
          message: `Error ocured while fetching data`,
          reason: error.message,
        })
        .code(500);
    }
  }
};

const getData = async (request, h) => {
  try {
    const result = await fetchDataDb();
    if (result.rowCount != 0) return h.response(result.rows);
    else
      return h
        .response({ success: false, message: `Table is empty` })
        .code(404);
  } catch (error) {
    return h
      .response({
        success: false,
        message: `Error ocured while fetching data`,
        reason: error.message,
      })
      .code(500);
  }
};

const saveData = async (request, h) => {
  const { key, value } = request.pre.data;
  try {
    await insertDataDb(key, value);
    await redisSetData(key, value);
    return h.response({
      success: true,
      message: `Data Successfully Saved`,
    });
  } catch (error) {
    return h
      .response({
        success: false,
        message: `Data could not be stored successfully`,
        reason: error.message,
      })
      .code(500);
  }
};

const updateDataByKey = async (request, h) => {
  const { key, value } = request.pre.data;
  try {
    const result = await updateDataByKeyDb(key, value);
    if (result.rowCount != 0) {
      await redisSetData(key, value);
      return h.response({
        success: true,
        message: `Data updated successfully`,
      });
    } else
      return h
        .response({
          success: false,
          message: `Key ${key} doesnot exists`,
        })
        .code(404);
  } catch (error) {
    return h
      .response({
        success: false,
        message: `Data could not be updated successfully`,
        reason: error.message,
      })
      .code(500);
  }
};

const deleteDataByKey = async (request, h) => {
  const { key } = request.pre.data;
  try {
    const result = await deleteDataByKeyDb(key);
    if (result.rowCount != 0) {
      await redisDelData(key);
      return h.response({
        success: true,
        message: `Data with key ${key} deleted from database`,
      });
    } else {
      return h
        .response({
          success: false,
          message: `Data with key ${key} doesnot exists`,
        })
        .code(404);
    }
  } catch (error) {
    return h
      .response({
        success: false,
        message: `Unable to delete data from DB`,
        reason: error.message,
      })
      .code(500);
  }
};

module.exports = {
  getDataByKey,
  getData,
  saveData,
  updateDataByKey,
  deleteDataByKey,
};
