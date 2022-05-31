import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";
import { User } from "./user";

const UserData = connection.define(
  "games_user",
  {
    id_game: {
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    id_user: {
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    status_game: {
      primaryKey: true,
      type: DataTypes.STRING,
    },
  },
  { timestamps: false, freezeTableName: true }
);

interface IuserDataModel {
  id_juego: number;
  id_usuario: number;
  estado: string;
}

export { UserData, IuserDataModel };
