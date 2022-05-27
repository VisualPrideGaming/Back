import {
  async,
  catchError,
  EMPTY,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { connection } from "../util/db";
import { deferrer } from "../util/promise2Observable";
import { Game, GameModel } from "./dataDbModel/game";
import { Genre, GenreGame, GenreModel } from "./dataDbModel/genres";
import { Platform, PlatformGame, PlatformModel } from "./dataDbModel/platform";

interface rawgWrap {
  count: number;
  next: string;
  previous: string;
  results: any[];
}

interface IGame {
  id?: number;
  name: string;
  image?: string;
  platforms?: IPlatform[];
  released: string;
  developer: string;
  rating: number;
  genres?: IGenre[];
  reviews?: IReview[];
}

interface subOption {
  id?: number;
  name: string;
  slug?: string;
}

interface IPlatform extends subOption {}
interface IGenre extends subOption {}
interface IReview extends subOption {}

async function findGamesOrCreate(games: IGame[]) {
  for (const game of games) {
    console.log("create game");
    const [gameRow, created] = await Game.findOrCreate({
      where: {
        game_name: game.name,
        release_date: game.released,
        image_game: game.image,
        developer: game.developer,
        rating: game.rating,
      },
    });

    if (created) {
      for (const genre of game.genres) {
        console.log("find genre");
        const [genreRow, created] = await Genre.findOrCreate({
          where: {
            genre: genre,
          },
        });

        console.log("Create genre");
        console.log(JSON.stringify(gameRow));
        console.log(JSON.stringify(gameRow.get("id")));
        await GenreGame.create({
          idGame: gameRow.get("id"),
          idGenre: genreRow.get("id"),
        });
      }

      for (const platform of game.platforms) {
        console.log("find platform");

        const [platformRow, created] = await Platform.findOrCreate({
          where: {
            platform: platform,
          },
        });

        console.log("create platform");
        await PlatformGame.create({
          idGame: gameRow.get("id"),
          idPlatform: platformRow.get("id"),
        });
      }
    }
  }
}

const createMany = (games: any[]) => {
  console.log(`Create the games in DB`);
  return deferrer(Game.bulkCreate(games));
};

export { IGame, rawgWrap, IGenre, IPlatform, findGamesOrCreate };
