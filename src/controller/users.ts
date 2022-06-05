import { catchError, Observable, of, throwError } from "rxjs";
import { Sequelize } from "sequelize/types";
import {
  IUser,
  getUsers as read,
  createUser as create,
  getUserDataFromDB,
  createUserDataDB,
  deleteUserDataDB,
  createReviewDB,
  getReviewDB,
  deleteReviewDB,
  modifyReviewDB,
} from "../model/users";
import { deferrer } from "../util/promise2Observable";

//saca los usuarios de la base de datos
const getAllUsers = (req, res): Observable<IUser[]> => {
  return read();
};

//crea un usuario
const createUser = (req, res): Observable<IUser[]> => {
  return create(req.body);
};

//saca las listas de juegos de un usuario
const getUserData = (id: number): Observable<IUser[]> => {
  return deferrer(getUserDataFromDB(id)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

//inserta un juego en la lista de un usuario
const createUserData = (req, res): Observable<IUser[]> => {
  const { userId, gameId, status } = req.body;
  return createUserDataDB(userId, gameId, status);
};

//elimina un juego de las listas de un usuario
const deleteUserData = (req, res): Observable<IUser[]> => {
  const { userId, gameId, status } = req.body;
  return deferrer(deleteUserDataDB(userId, gameId, status)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

//crea la review
const createUserReview = (req, res): Observable<IUser[]> => {
  const { userId, gameId, score, review } = req.body;
  return createReviewDB(userId, gameId, score, review);
};

//saca las reviews que creo un usuario
const getReview = (idUser: number): Observable<IUser[]> => {
  return deferrer(getReviewDB(idUser)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

//elimina la review
const deleteReview = (req, res): Observable<IUser[]> => {
  const { userId, gameId } = req.body;
  return deferrer(deleteReviewDB(userId, gameId)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

//modifica una review dado un usuario y un juego
const modifyReview = (req, res): Observable<IUser[]> => {
  const { score, review } = req.body;
  const userId = +req.query.user.toString();
  const gameId = +req.query.game.toString();
  return modifyReviewDB(userId, gameId, score, review);
};

export {
  getAllUsers,
  createUser,
  getUserData,
  createUserData,
  deleteUserData,
  createUserReview,
  getReview,
  deleteReview,
  modifyReview,
};
