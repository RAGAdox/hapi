const fecthRoutes = require("./fetchRoutes");
const writeRoutes = require("./writeRoutes");
module.exports = [].concat(writeRoutes).concat(fecthRoutes);
