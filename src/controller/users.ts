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
} from "../model/users";
import { deferrer } from "../util/promise2Observable";

const getAllUsers = (req, res): Observable<IUser[]> => {
  return read();
};

const createUser = (req, res): Observable<IUser[]> => {
  return create(req.body);
};

const getUserData = (id: number): Observable<IUser[]> => {
  return deferrer(getUserDataFromDB(id)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

const createUserData = (req, res): Observable<IUser[]> => {
  const { userId, gameId, status } = req.body;
  return createUserDataDB(userId, gameId, status);
};

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

const createUserReview = (req, res): Observable<IUser[]> => {
  const { userId, gameId, score, review } = req.body;
  return createReviewDB(userId, gameId, score, review);
};

const getReview = (idUser: number): Observable<IUser[]> => {
  return deferrer(getReviewDB(idUser)).pipe(
    catchError((error) =>
      of({
        error,
      })
    )
  );
};

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

export {
  getAllUsers,
  createUser,
  getUserData,
  createUserData,
  deleteUserData,
  createUserReview,
  getReview,
  deleteReview,
};
