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

const getAllGames = (): Observable<rawgWrap> => {
  console.log("axios call");
  return deferrer(axios.get(`/games`)).pipe(map((res) => res.data));
};

const getGamesFiltered = (filter: string): Observable<rawgWrap> => {
  return deferrer(axios.get(`/games?search=${filter}`));
};

const getTopGames = (): Observable<rawgWrap> => {
  console.log("axios call");
  return deferrer(axios.get(`/games?ordering=-rating&page_size=10`)).pipe(
    map((res) => res.data),
    tap((res: rawgWrap) => {
      const gamesToCheck = res.results.map((game) => ({
        name: game.name,
        released: game.released,
        developer: null,
        rating: game.rating,
        image: game.background_image,
        genres: game.genres.map((genre) => genre.name),
        platforms: game.platforms.map((platform) => platform.platform.name),
      }));

      findGamesOrCreate(gamesToCheck);
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

export { getAllGames, getGamesFiltered, getTopGames };
