//Middleware to transform data and apply proper validation on input data
const {
  transformData,
  keyValueValidation,
  keyValidation,
} = require("../middleware/util");
//Write Controllers
const {
  saveData,
  updateDataByKey,
  deleteDataByKey,
} = require("../controllers");

module.exports = [
  {
    method: "POST",
    path: "/save",
    options: {
      validate: {
        payload: keyValueValidation,
      },
      pre: [{ method: transformData, assign: "data" }],
    },
    handler: saveData,
  },
  {
    method: "PUT",
    path: "/update",
    options: {
      validate: {
        payload: keyValueValidation,
      },
      pre: [{ method: transformData, assign: "data" }],
    },
    handler: updateDataByKey,
  },
  {
    method: "DELETE",
    path: "/delete",
    options: {
      validate: {
        payload: keyValidation,
      },
      pre: [{ method: transformData, assign: "data" }],
    },
    handler: deleteDataByKey,
  },
];
