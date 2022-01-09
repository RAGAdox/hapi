const Joi = require("joi");
const { redisSetData, redisDelData } = require("../redis/index");
const { query } = require("../database/queryExecutor");
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

const validateData = (request, h) => {
  console.log(`Validate`);
  if (request.payload) {
    const { key, value } = request.payload;
    return {
      key: key ? key.toString() : undefined,
      value: value ? value.toString() : undefined,
    };
  } else {
    return h.response({ success: false }).takeover();
  }
};
module.exports = [
  {
    method: "POST",
    path: "/save",
    options: {
      validate: {
        payload: Joi.object({
          key: Joi.required(),
          value: Joi.required(),
        }),
      },
      pre: [{ method: validateData, assign: "data" }],
    },
    handler: async (request, h) => {
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
    },
  },
  {
    method: "PUT",
    path: "/update",
    options: {
      validate: {
        payload: Joi.object({
          key: Joi.required(),
          value: Joi.required(),
        }),
      },
      pre: [{ method: validateData, assign: "data" }],
    },
    handler: async (request, h) => {
      const { key, value } = request.payload;
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
    },
  },
  {
    method: "DELETE",
    path: "/delete",
    options: {
      validate: {
        payload: Joi.object({
          key: Joi.required(),
        }),
      },
      pre: [{ method: validateData, assign: "data" }],
    },
    handler: async (request, h) => {
      const { key } = request.payload;
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
    },
  },
];
