import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";
import { Game } from "./game";

const Genre = connection.define(
  "genres",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    genre: DataTypes.STRING,
  },
  { timestamps: false, freezeTableName: true }
);

interface GenreModel {
  id?: number;
  genre: string;
}

const GenreGame = connection.define(
  "genres_games",
  {
    idGenre: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: Genre,
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

// Genre.belongsToMany(Game, {
//   through: GenreGame,
// });
export { Genre, GenreModel, GenreGame };
