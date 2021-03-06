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

//Busca en la base de datos el juego si esta creado no hace nada y si no esta creado lo crea
async function findGamesOrCreate(games: IGame[]) {
  try {
    for (const game of games) {
      console.log("create game");
      const [gameRow, created] = await Game.findOrCreate({
        where: {
          game_name: game.name,
        },
        defaults: {
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
    const gamesFound = await Game.sequelize.query(
      `
      SELECT g.id as id, game_name as name, release_date as released, image_game as image, developer as developer, rating as rating , GROUP_CONCAT(DISTINCT (ge.genre)) as genres ,GROUP_CONCAT(DISTINCT (p.platform)) as platforms 
      from games g
      LEFT join
      platform_games pg
      on
      g.id = pg.idGame
      LEFT join platforms p
      on 
      p.id = pg.idPlatform
      LEFT join genres_games gg
      on
      g.id = pg.idGame
      LEFT join genres ge
      on
      p.id = gg.idGenre
      where
      game_name in (${games
        .map((a) => "'" + a.name.replace("'", "''") + "'")
        .join()})
      GROUP BY g.id;
      `
    );
    return gamesFound[0].map((game: any) => ({
      ...game,
      genres: game.genres?.split(","),
      platforms: game.platforms?.split(","),
    }));
  } catch (error) {
    return new Promise(() => {
      throw error;
    });
  }
}

//busca las reviews de un juego
const getReviewGameDB = async (game: number) => {
  try {
    const queryReview = getReviewGameQuery(game);
    const listReview = await Game.sequelize.query(queryReview);

    return {
      reviews: listReview[0],
    };
  } catch (error) {
    return new Promise(() => {
      throw error;
    });
  }
};

const getGameByIdDB = async (game: number) => {
  try {
    const queryReview = `
    SELECT g.id as id, game_name as name, release_date as released, image_game as image, developer as developer, rating as rating , GROUP_CONCAT(DISTINCT (ge.genre)) as genres ,GROUP_CONCAT(DISTINCT (p.platform)) as platforms 
    from games g
    LEFT join
    platform_games pg
    on
    g.id = pg.idGame
    LEFT join platforms p
    on 
    p.id = pg.idPlatform
    LEFT join genres_games gg
    on
    g.id = pg.idGame
    LEFT join genres ge
    on
    p.id = gg.idGenre
    where
    g.id = ${game};`;
    const games: any = await Game.sequelize.query(queryReview);
    return {
      ...games[0][0],
      genres: games[0][0].genres.split(","),
      platforms: games[0][0].platforms.split(","),
    };
  } catch (error) {
    return new Promise(() => {
      throw error;
    });
  }
};

//query de sacar las reviews de juego
function getReviewGameQuery(id: number) {
  return `
  SELECT u.* , r.review , r.score  FROM users u
  INNER JOIN reviews r
  on
  u.id = r.id_user
  WHERE 
  r.id_game = ${id};`;
}

export {
  IGame,
  rawgWrap,
  IGenre,
  IPlatform,
  findGamesOrCreate,
  getReviewGameDB,
  getGameByIdDB,
};
