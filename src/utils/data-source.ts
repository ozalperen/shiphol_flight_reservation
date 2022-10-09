require("dotenv").config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import config from "config";

  

const postgresConfig = config.get<{
  developmentHost: string;
  port: number;
  username: string;
  password: string;
  database: string;
}>("postgresConfig");

if (process.env.NODE_ENV === "production") {
  postgresConfig.database = config.get<string>("producHost");
}
export const AppDataSource = new DataSource({
  ...postgresConfig,
  type: "postgres",
  synchronize: false,
  logging: false,
  entities: ["src/entities/**/*.entity{.ts,.js}"],
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
});
