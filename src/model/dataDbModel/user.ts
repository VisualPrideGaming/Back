import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";

const User = connection.define(
  "users",
  {
    //id: DataTypes.NUMBER,
    nickname: DataTypes.STRING,
    rol: DataTypes.STRING,
  },
  { timestamps: false, freezeTableName: true }
);

export { User };
