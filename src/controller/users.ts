import { Observable, of } from "rxjs";
import { Sequelize } from "sequelize/types";
import {
  IUser,
  getUsers as read,
  createUser as create,
  getUserDataFromDB,
  createUserDataDB,
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

const createUserData = (req, res): Observable<IUser[]> => {
  const { userId, gameId, status } = req.body;
  return createUserDataDB(userId, gameId, status);
};

export { getAllUsers, createUser, getUserData, createUserData };
