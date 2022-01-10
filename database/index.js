const { Sequelize } = require("sequelize");
//DATABASE CREDENTIALS
const pgHost = process.env.PGHOST;
const pgUser = process.env.PGUSER;
const pgPassword = process.env.PGPASSWORD;
const pgDbName = process.env.PGDATABASE;
const pgPort = process.env.PGPORT;

const sequelize = new Sequelize(
  `postgres://${pgUser}:${pgPassword}@${pgHost}:${pgPort}/${pgDbName}`,
  { logging: false }
);
module.exports = { sequelize };
