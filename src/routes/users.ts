import express from "express";
const router = express.Router();

import { checkQueryParam } from "../interceptor/checks";
import {
  getAllUsers,
  createUser,
  getUserData,
  createUserData,
  deleteUserData,
  createUserReview,
  getReview,
  deleteReview,
  modifyReview,
} from "../controller/users";
import { IUser } from "../model/users";

//localhost:3003/users
router.get("/users", function (req, res) {
  getAllUsers(req, res).subscribe((users: IUser[]) => {
    res.send(users);
  });
});

//localhost:3003/users
/*
{
    "id": 3,
    "nickname": "Dios",
    "rol": "te salio caldo"
}
*/
router.post("/users", function (req, res) {
  createUser(req, res).subscribe((users: IUser[]) => {
    res.send(users);
  });
});

//localhost:3003/users/data?user=1
router.get("/users/data", checkQueryParam(["user"]), function (req, res) {
  getUserData(+req.query.user.toString()).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

//localhost:3003/users/data
/*
{
    "userId" : 1,
    "gameId" : 42,
    "status" : "Deseado"
}
*/
router.post("/users/data", function (req, res) {
  createUserData(req, res).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

//localhost:3003/users/data
/*
{
    "userId" : 1,
    "gameId" : 45,
    "status" : "Deseado"

}
*/
router.delete("/users/data", function (req, res) {
  deleteUserData(req, res).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

//localhost:3003/users/reviews
/* 
{
  "gameId": 43,
  "userId": 1,
  "score": 5,
  "review": "asdasd mierda"
}
*/
router.post("/users/reviews", function (req, res) {
  createUserReview(req, res).subscribe((review: any[]) => {
    res.send(review);
  });
});

//localhost:3003/users/reviews?user=1
router.get("/users/reviews", checkQueryParam(["user"]), function (req, res) {
  getReview(+req.query.user.toString()).subscribe((review: any) => {
    res.send(review);
  });
});
//localhost:3003/users/reviews
/*
{
    "userId" : 1,
    "gameId" : 42
}
*/
router.delete("/users/reviews", function (req, res) {
  deleteReview(req, res).subscribe((review: any) => {
    res.send(review);
  });
});

//localhost:3003/users/reviews?game=43&user=1
/* 
{
  "score": 5,
  "review": "asdasd mierda"
}
*/
router.patch(
  "/users/reviews",
  checkQueryParam(["user", "game"]),
  function (req, res) {
    modifyReview(req, res).subscribe((review: any) => {
      res.send(review);
    });
  }
);
export { router };
