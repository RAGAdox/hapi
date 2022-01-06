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
module.exports = [
  {
    method: "POST",
    path: "/save",
    handler: async (request, h) => {
      const { key, value } = request.payload;
      try {
        await insertDataDb(key, value);
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
    handler: async (request, h) => {
      const { key, value } = request.payload;
      try {
        const result = await updateDataByKeyDb(key, value);
        if (result.rowCount != 0)
          return h.response({
            success: true,
            message: `Data updated successfully`,
          });
        else
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
    handler: async (request, h) => {
      const { key } = request.payload;
      try {
        const result = await deleteDataByKeyDb(key);
        if (result.rowCount != 0)
          return h.response({
            success: true,
            message: `Data with key ${key} deleted from database`,
          });
        else {
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
