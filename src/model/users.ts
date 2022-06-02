import { async, Observable, of } from "rxjs";
import { connection } from "../util/db";
import { deferrer } from "../util/promise2Observable";
import { Review } from "./dataDbModel/review";
import { User } from "./dataDbModel/user";
import { UserData } from "./dataDbModel/userDataLists";

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

const createUserDataDB = (
  userId: number,
  gameId: number,
  status: string
): Observable<IUser[]> => {
  return deferrer(
    UserData.create({
      id_game: gameId,
      id_user: userId,
      status_game: status,
    })
  );
};

const getUserDataFromDB = async (user: number) => {
  const queryDeseados = getStatusGameQuery("Deseado", user);
  const listDeaseados = await User.sequelize.query(queryDeseados);

  const queryPasados = getStatusGameQuery("Pasado", user);
  const listPasados = await User.sequelize.query(queryPasados);

  const queryFavoritos = getStatusGameQuery("Favoritos", user);
  const listFavoritos = await User.sequelize.query(queryFavoritos);

  const queryComprado = getStatusGameQuery("Comprado", user);
  const listComprado = await User.sequelize.query(queryComprado);

  return {
    deseados: listDeaseados,
    favoritos: listFavoritos,
    pasados: listPasados,
    comprado: listComprado,
  };
};

const deleteUserDataDB = async (
  userId: number,
  gameId: number,
  status: string
) => {
  const destroyAllHumans = await UserData.destroy({
    where: {
      id_game: gameId,
      id_user: userId,
      status_game: status,
    },
  });
};

const createReviewDB = (
  userId: number,
  gameId: number,
  score: number,
  review: string
): Observable<IUser[]> => {
  return deferrer(
    Review.create({
      id_game: gameId,
      id_user: userId,
      score: score,
      review: review,
    })
  );
};

const getReviewDB = async (user: number) => {
  const queryReview = getReviewQuery(user);
  const listReview = await User.sequelize.query(queryReview);

  return {
    reviews: listReview[0],
  };
};

function getStatusGameQuery(status: string, id: number) {
  return `
SELECT g.* FROM games g
INNER JOIN games_user gu
on
g.id = gu.id_game
WHERE 
gu.status_game = "${status}" AND
gu.id_user = ${id};`;
}

function getReviewQuery(id: number) {
  return `
  SELECT g.* , r.review , r.score  FROM games g 
  INNER JOIN reviews r
  on
  g.id = r.id_game
  WHERE 
  r.id_user = ${id};`;
}

export {
  IUser,
  getUsers,
  createUser,
  getUserDataFromDB,
  createUserDataDB,
  deleteUserDataDB,
  createReviewDB,
  getReviewDB,
};
