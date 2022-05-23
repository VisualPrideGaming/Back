import express from "express";
const router = express.Router();

import { checkQueryParam } from "../interceptor/checks";
import { getAllUsers, createUser } from "../controller/users";
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

export { router };
