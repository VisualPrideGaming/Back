import { Observable, of } from "rxjs";
import { connection } from "../util/db";
import { deferrer } from "../util/promise2Observable";
import { User } from "./dataDbModel/user";

interface IUser {
  id?: number;
  nickname: string;
  rol: string;
}

const getUsers = (): Observable<IUser[]> => {
  console.log(`Get All Users from DB`);
  return deferrer(User.findAll());
};

const createUser = (user: IUser): Observable<IUser[]> => {
  console.log(`Get All Users from DB`);
  //const usuario: IUser = { nickname: "moshi", rol: "admin" };
  return deferrer(User.create({ nickname: user.nickname, rol: user.rol }));
};

export { IUser, getUsers, createUser };
