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
  image: string;
  platforms: platform[];
  released: string;
  developer: string;
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

const checkGamesToSave = (nameList: string[]): Observable<IGame[]> => {
  console.log(`Get All Users from DB`);
  return deferrer(
    Game.findAll({
      where: {
        game_name: nameList,
      },
    })
  ).pipe(
    map((games: GameModel[]) => {
      return games.map(
        (game: GameModel): IGame => ({
          id: game.id,
          name: game.game_name,
          image: game.image_game,
          developer: game.developer,
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

const createMany = (games: any[]) => {
  console.log(`Create the games in DB`);
  return deferrer(Game.bulkCreate(games));
};

export { IGame, rawgWrap, genres, platform, checkGamesToSave, createMany };
