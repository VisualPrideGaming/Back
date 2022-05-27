import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";
import { Game } from "./game";

const Platform = connection.define(
  "platforms",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    platform: DataTypes.STRING,
  },
  { timestamps: false, freezeTableName: true }
);

interface PlatformModel {
  id?: number;
  platform: string;
}

const PlatformGame = connection.define(
  "platform_games",
  {
    idPlatform: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Platform,
        key: "id",
      },
    },
    idGame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Game,
        key: "id",
      },
    },
  },
  { timestamps: false, freezeTableName: true }
);

// Platform.belongsToMany(Game, {
//   through: PlatformGame,
// });

export { Platform, PlatformModel, PlatformGame };
