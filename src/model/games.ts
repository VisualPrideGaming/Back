import { map, Observable, of } from "rxjs";
import { connection } from "../util/db";
import { deferrer } from "../util/promise2Observable";
import { Game, GameModel } from "./dataDbModel/game";

interface rawgWrap {
  count: number;
  next: string;
  previous: string;
  results: IGame[];
}

interface IGame {
  id: number;
  name: string;
  platforms: platform[];
  released: string;
  rating: number;
  genres: genres[];
  reviews: reviews[];
}

interface subOption {
  id: number;
  name: string;
  slug?: string;
}

interface platform extends subOption {}
interface genres extends subOption {}
interface reviews extends subOption {}

const checkGamesToSave = (idList: number[]): Observable<IGame[]> => {
  console.log(`Get All Users from DB`);
  return deferrer(
    Game.findAll({
      where: {
        id: idList,
      },
    })
  ).pipe(
    map((games: GameModel[]) => {
      return games.map(
        (game: GameModel): IGame => ({
          id: game.id,
          name: game.game_name,
          platforms: [],
          released: game.release_date,
          rating: game.rating,
          genres: [],
          reviews: [],
        })
      );
    })
  );
};

export { IGame, rawgWrap, genres, platform, checkGamesToSave };
