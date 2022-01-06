const Hapi = require(`@hapi/hapi`);
const routes = require("./routes/index");
const init = async () => {
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
      {
        method: "GET",
        path: `/t`,
        handler: (request, h) => {
          return `Hello`;
        },
      },
    ].concat(routes)
  );
  await server.start();
  console.log(`Server Started on ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
