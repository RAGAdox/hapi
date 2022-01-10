//Validation Middleware
const { keyValidation } = require("../middleware/util");
//Fetch Controllers
const { getDataByKey, getData } = require("../controllers");

module.exports = [
  {
    method: "GET",
    path: "/get",
    options: {
      validate: {
        query: keyValidation,
      },
    },
    handler: getDataByKey,
  },
  {
    method: "GET",
    path: "/getall",
    handler: getData,
  },
];
