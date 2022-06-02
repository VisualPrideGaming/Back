import { catchError, EMPTY, map, Observable, of, switchMap, tap } from "rxjs";
import { findGamesOrCreate, IGame, rawgWrap } from "../model/games";
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
  return deferrer(axios.get(`/games`)).pipe(map((res) => res.data));
};

//sacar los juegos filtrados por nombre
const getGamesFiltered = (filter: string): Observable<any> => {
  return deferrer(axios.get(`/games?search=${filter}`)).pipe(
    map((res) => res.data),
    switchMap((res: rawgWrap) => {
      return mapAndCreateGame(res.results);
    })
  );
};

//sacar 10 juegos ordenados por las criticas mas positivas
const getTopGames = (): Observable<any> => {
  console.log("axios call");
  return deferrer(axios.get(`/games?ordering=meteacritic&page_size=10`)).pipe(
    map((res) => res.data),
    switchMap((res: rawgWrap) => {
      return mapAndCreateGame(res.results);
    })
  );
};

const generateRawgWrap = () => {
  return {
    count: 0,
    next: "",
    previous: "",
    results: [],
  };
};

//
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

  return deferrer(findGamesOrCreate(gamesToCheck));
}

export { getAllGames, getGamesFiltered, getTopGames };
