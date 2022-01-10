//Redis Methods to save and update cache
const { redisGetData, redisSetData, redisDelData } = require("../redis");
//SEQUELIZE Data Model providing Database functionality as Functions
const Data = require("../models/dataModel");
//Controller Functions to perform CRUD Operations

const getDataByKey = async (request, h) => {
  const key = request.query.key;
  let data = await redisGetData(key);
  if (data !== null) {
    return h.response({ key: key, value: data });
  } else {
    try {
      const result = await Data.findAll({
        where: { key: key },
        attributes: ["key", "value"],
      });
      
      if (result && result.length !== 0) {
        await redisSetData(result[0].key, result[0].value);
        return h.response(result[0]);
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
    const result = await Data.findAll({ attributes: ["key", "value"] });
    if (result && result.length != 0) return h.response(result);
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
    await Data.create({ key: key, value: value });
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
    const result = await Data.update({ value: value }, { where: { key: key } });

    if (result != 0) {
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
    const result = await Data.destroy({ where: { key: key } });
    if (result != 0) {
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
