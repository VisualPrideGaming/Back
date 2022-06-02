import express from "express";
const router = express.Router();

import { checkQueryParam } from "../interceptor/checks";
import {
  getAllUsers,
  createUser,
  getUserData,
  createUserData,
  deleteUserData,
} from "../controller/users";
import { deleteUserDataDB, IUser } from "../model/users";

router.get("/users", function (req, res) {
  getAllUsers(req, res).subscribe((users: IUser[]) => {
    res.send(users);
  });
});

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

router.delete("/users/data", function (req, res) {
  deleteUserData(req, res).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

export { router };
