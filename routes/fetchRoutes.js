const Joi = require("joi");
const { redisSetData, redisGetData } = require("../redis/index");
const { query } = require("../database/queryExecutor");
const fetchDataByKeyDb = async (key) => {
  return query(`SELECT * FROM DATA WHERE KEY = $1 `, [key]);
};
const fetchDataDb = async () => {
  return query(`SELECT * FROM DATA;`);
};
module.exports = [
  {
    method: "GET",
    path: "/get",
    options: {
      validate: {
        query: Joi.object({ key: Joi.string().required() }),
      },
    },
    handler: async (request, h) => {
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
    },
  },
  {
    method: "GET",
    path: "/getall",
    handler: async (request, h) => {
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
    },
  },
];
