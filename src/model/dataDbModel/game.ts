import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";

const Game = connection.define(
  "Games",
  {
    //id: DataTypes.NUMBER,
    game_name: DataTypes.STRING,
    platform: DataTypes.NUMBER,
    release_date: DataTypes.DATE,
    genre: DataTypes.NUMBER,
    image_game: DataTypes.STRING,
    developer: DataTypes.STRING,
    rating: DataTypes.NUMBER,
  },
  { timestamps: false, freezeTableName: true }
);

interface GameModel {
  id: number;
  game_name: string;
  platform: number;
  release_date: string;
  genre: number;
  image_game: string;
  developer: string;
  rating: number;
}
export { Game, GameModel };
