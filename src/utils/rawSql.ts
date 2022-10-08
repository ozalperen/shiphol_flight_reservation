import config from "config";

const postgresConfig = config.get<{
  developmentHost: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>("postgresConfig");

const Pool = require("pg").Pool;
export const pool = new Pool({
  user: postgresConfig.username,
  host: postgresConfig.developmentHost,
  database: postgresConfig.database,
  password: postgresConfig.password,
  port: postgresConfig.port,
});
