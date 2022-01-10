require("dotenv").config();
const Hapi = require(`@hapi/hapi`);

const routes = require("./routes/index");
//Global Redis Client for caching
const { redisClient } = require("./redis");

const { sequelize } = require("./database");

const init = async () => {
  redisClient.connect();

  const server = Hapi.server({
    port: 3000,
    host: "localhost",
  });

  server.route(
    [
      {
        method: "*",
        path: "/{any*}",
        handler: (request, h) => {
          return "404 Error! Route not found";
        },
      },
    ].concat(routes)
  );

  redisClient.on("connect", async () => {
    console.log("Redis Connected");
    await sequelize.sync({ force: false });
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
