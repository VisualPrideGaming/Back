import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";
import { Genre, GenreGame } from "./genres";
import { Platform, PlatformGame } from "./platform";

const Game = connection.define(
  "games",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    game_name: DataTypes.STRING,
    release_date: DataTypes.DATE,
    image_game: DataTypes.STRING,
    developer: DataTypes.STRING,
    rating: DataTypes.NUMBER,
  },
  { timestamps: false, freezeTableName: true }
);

// Game.belongsToMany(Genre, {
//   through: GenreGame,
// });

// Game.belongsToMany(Platform, {
//   through: PlatformGame,
// });

interface GameModel {
  id?: number;
  game_name: string;
  release_date: string;
  image_game: string;
  developer: string;
  rating: number;
}

export { Game, GameModel };
