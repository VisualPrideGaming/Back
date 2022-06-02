import { timestamp } from "rxjs";
import { DataTypes } from "sequelize";
import { connection } from "../../util/db";

const Review = connection.define(
  "reviews",
  {
    id_game: {
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    id_user: {
      primaryKey: true,
      type: DataTypes.NUMBER,
    },
    score: {
      type: DataTypes.NUMBER,
    },
    review: {
      type: DataTypes.STRING,
    },
  },
  { timestamps: false, freezeTableName: true }
);

interface IReview {
  id_juego: number;
  id_usuario: number;
  score: number;
  review: string;
}

export { Review, IReview };
