import { Sequelize } from "sequelize";
import config from "./config";

const sequelize = new Sequelize(
  config.DB_NAME,
  config.DB_USER,
  config.DB_PASS,
  {
    host: config.DB_HOST,
    port: config.DB_PORT,
    dialect: "mysql",
  }
);

export { sequelize as connection };
