import { catchError, map, Observable, of, switchMap, tap } from "rxjs";
import {
  findGamesOrCreate,
  getGameByIdDB,
  getReviewGameDB,
  IGame,
  rawgWrap,
} from "../model/games";
import { deferrer } from "../util/promise2Observable";
import env from "../util/config";
import axiosMaster from "axios";
import { response } from "express";
import { Platform } from "../model/dataDbModel/platform";
import { Genre } from "../model/dataDbModel/genres";

const axios = axiosMaster.create({
  baseURL: `${env.RAWG_API_URL}`,
  timeout: 1000,
});

axios.interceptors.request.use(function (config) {
  const token = env.RAWG_API_KEY;
  config.params = { ...config.params, key: token };
  return config;
});

//sacar todos los juegos
const getAllGames = (): Observable<rawgWrap> => {
  console.log("axios call");
  return deferrer(axios.get(`/games`)).pipe(
    catchError((error) =>
      of({
        error,
      })
    ),
    map((res) => res.data)
  );
};

//sacar los juegos filtrados por nombre
const getGamesFiltered = (filter: string): Observable<any> => {
  return deferrer(axios.get(`/games?search=${filter}`)).pipe(
    catchError((error) =>
      of({
        error,
      })
    ),
    map((res) => res.data),
    switchMap((res: rawgWrap) => {
      return mapAndCreateGame(res.results);
    })
  );
};

//saca un juego filtrado por id
const getGameById = (filter: number): Observable<any> => {
  return deferrer(getGameByIdDB(filter)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

//sacar 10 juegos ordenados por las criticas mas positivas
const getTopGames = (): Observable<any> => {
  console.log("axios call");
  return deferrer(axios.get(`/games?ordering=meteacritic&page_size=10`)).pipe(
    catchError((error) =>
      of({
        error,
      })
    ),
    map((res) => res.data),
    switchMap((res: rawgWrap) => {
      return mapAndCreateGame(res.results);
    })
  );
};

//saca las reviews de un juego
const getReviewGame = (idGame: number): Observable<IGame[]> => {
  return deferrer(getReviewGameDB(idGame)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

function mapAndCreateGame(games: any[]) {
  const gamesToCheck = games.map((game) => ({
    name: game.name,
    released: game.released,
    developer: null,
    rating: game.rating,
    image: game.background_image,
    genres: game.genres.map((genre) => genre.name),
    platforms: game.platforms.map((platform) => platform.platform.name),
  }));

  return deferrer(findGamesOrCreate(gamesToCheck)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
}

export {
  getAllGames,
  getGamesFiltered,
  getTopGames,
  getReviewGame,
  getGameById,
};
