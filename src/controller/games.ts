import { catchError, EMPTY, map, Observable, of, switchMap } from "rxjs";
import { checkGamesToSave, createMany, IGame, rawgWrap } from "../model/games";
import { deferrer } from "../util/promise2Observable";
import env from "../util/config";
import axiosMaster from "axios";
import { response } from "express";

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
  return deferrer(axios.get(`/games?ordering=-rating&page_size=10`))
    .pipe(map((res) => res.data))
    .pipe(
      switchMap((res: rawgWrap): Observable<any> => {
        const gamesIds = res.results.map((game: IGame) => game.name);

        return checkGamesToSave(gamesIds).pipe(
          switchMap((games: IGame[]): Observable<any> => {
            if (gamesIds.length !== games.length) {
              const gamesDbId = games.map((game: IGame) => game.name);
              const gamesToCreate = gamesIds
                .filter((x) => !gamesDbId.includes(x))
                .map((name: string) => {
                  const gameFound = res.results.find(
                    (game: IGame) => game.name === name
                  );

                  return {
                    game_name: gameFound.name,
                    platform: null,
                    release_date: gameFound.released,
                    genre: null,
                    image_game: gameFound.image,
                    developer: gameFound.developer,
                    rating: gameFound.rating,
                  };
                });

              createMany(gamesToCreate).pipe(
                catchError((err) => {
                  throw "error : " + err;
                })
              );
            }

            return of(res);
          })
        );
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
