import { Observable, of } from "rxjs";
import { Sequelize } from "sequelize/types";
import {
  IUser,
  getUsers as read,
  createUser as create,
  getUserDataFromDB,
} from "../model/users";
import { deferrer } from "../util/promise2Observable";

const getAllUsers = (req, res): Observable<IUser[]> => {
  return read();
};

const createUser = (req, res): Observable<IUser[]> => {
  return create(req.body);
};

const getUserData = (id: number): Observable<IUser[]> => {
  return deferrer(getUserDataFromDB(id));
};

export { getAllUsers, createUser, getUserData };
