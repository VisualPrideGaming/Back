import { Observable, of } from "rxjs";
import { Sequelize } from "sequelize/types";
import { IUser, getUsers as read, createUser as create } from "../model/users";

const getAllUsers = (req, res): Observable<IUser[]> => {
  return read();
};

const createUser = (req, res): Observable<IUser[]> => {
  return create(req.body);
};

export { getAllUsers, createUser };
