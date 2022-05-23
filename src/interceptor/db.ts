import { Sequelize } from "sequelize/types";

const addConnection = (connection: Sequelize) => {
  return (req, res, next) => {
    if (connection) {
      req.dbConnection = connection;
    }
    next();
  };
};

export { addConnection };
