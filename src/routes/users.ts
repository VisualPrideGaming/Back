import express from "express";
const router = express.Router();

import { checkQueryParam } from "../interceptor/checks";
import {
  getAllUsers,
  createUser,
  getUserData,
  createUserData,
} from "../controller/users";
import { IUser } from "../model/users";

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

router.get("/users/data", checkQueryParam(["user"]), function (req, res) {
  getUserData(+req.query.user.toString()).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

router.post("/users/data", function (req, res) {
  createUserData(req, res).subscribe((userData: any[]) => {
    res.send(userData);
  });
});

export { router };
