import path from "path";
import dotenv from "dotenv";

// Parsing the env file.
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Interface to load env variables
// Note these variables can possibly be undefined
// as someone could skip these varibales or not setup a .env file at all

interface ENV {
  RAWG_API_KEY: string | undefined;
  RAWG_API_URL: string | undefined;
  PORT: number | undefined;
  BASE_URL: string | undefined;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
  DB_PORT: number;
}

interface Config {
  RAWG_API_KEY: string;
  RAWG_API_URL: string;
  PORT: number;
  BASE_URL: string;
  DB_NAME: string;
  DB_USER: string;
  DB_PASS: string;
  DB_HOST: string;
  DB_PORT: number;
}

// Loading process.env as ENV interface

const getConfig = (): ENV => {
  return {
    RAWG_API_KEY: process.env.RAWG_API_KEY,
    RAWG_API_URL: process.env.RAWG_API_URL,
    PORT: process.env.PORT ? Number(process.env.PORT) : undefined,
    BASE_URL: process.env.BASE_URL,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined,
  };
};

// Throwing an Error if any field was undefined we don't
// want our app to run if it can't connect to DB and ensure
// that these fields are accessible. If all is good return
// it as Config which just removes the undefined from our type
// definition.

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as Config;
};

const config = getConfig();

const sanitizedConfig = getSanitzedConfig(config);

export default sanitizedConfig;
