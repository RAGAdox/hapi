require("dotenv").config({
  path: `./.env${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}`,
});
const Hapi = require(`@hapi/hapi`);

const routes = require("./routes");
//Global Redis Client for caching
const { redisClient } = require("./redis");
const { sequelize } = require("./database");
const server = Hapi.server({
  port: process.env.PORT || 3000,
  host: process.env.HOST || "localhost",
});
const init = async () => {
  redisClient.connect();

  server.route(
    [
      {
        method: "*",
        path: "/{any*}",
        handler: (request, h) => {
          return h
            .response({ message: `404 Error! Route not found` })
            .code(404);
        },
      },
    ].concat(routes)
  );

  redisClient.on("connect", async () => {
    console.log("Redis Connected");
    await sequelize.sync({ force: process.env.FORCE_SYNC === 1 });
    console.log(`Database Syncronized`);
    await server.start();
    console.log(`Server Started on ${server.info.uri}`);
  });
};

redisClient.on("error", (err) => {
  console.log(`Redis Client Error`, err);
  process.exit(1);
});
process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
module.exports = server;
