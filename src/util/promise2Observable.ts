import { defer, from, Observable } from "rxjs";

//tranforma una promesa en un observable
const deferrer = (promise: Promise<any>): Observable<any> => {
  return defer(() => from(promise));
};

export { deferrer };
