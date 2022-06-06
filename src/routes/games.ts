import express from "express";
const router = express.Router();

import { checkQueryParam } from "../interceptor/checks";
import {
  getAllGames,
  getGameById,
  getGamesFiltered,
  getReviewGame,
  getTopGames,
} from "../controller/games";
import { rawgWrap } from "../model/games";

// List all games
//
router.get("/games", function (req, res) {
  console.log("/games");
  getAllGames().subscribe(
    (games: rawgWrap) => {
      if (games) {
        console.log(`Found ${games.count} games`);
        res.send(games);
      }
    },
    (error) => {
      console.error(error);
    }
  );
});

// Search games by filter
//localhost:3003/games/filter?search=campoArellenar
router.get("/games/filter", checkQueryParam(["search"]), function (req, res) {
  getGamesFiltered(req.query.search.toString()).subscribe(
    (games: rawgWrap) => {
      console.log(games);
      if (games) {
        console.log(`Found ${games.count} games`);
        res.send(games);
      }
    },
    (error) => {
      console.error(error);
    }
  );
});

// Search games by filter
//localhost:3003/game?game=43
router.get("/game", checkQueryParam(["game"]), function (req, res) {
  getGameById(+req.query.game.toString()).subscribe(
    (games: rawgWrap) => {
      console.log(games);
      if (games) {
        console.log(`Found ${games.count} games`);
        res.send(games);
      }
    },
    (error) => {
      console.error(error);
    }
  );
});

//localhost:3003/games/top
router.get("/games/top", function (req, res) {
  console.log("/games/top");
  getTopGames().subscribe(
    (games: rawgWrap) => {
      if (games) {
        //console.log(games);
        console.log(`Found ${games.count} games`);
        res.send(games);
      }
    },
    (error) => {
      console.error(error);
    }
  );
});

//localhost:3003/games/reviews
router.get("/games/reviews", checkQueryParam(["game"]), function (req, res) {
  getReviewGame(+req.query.game.toString()).subscribe((gameData: any) => {
    res.send(gameData);
  });
});

export { router };
