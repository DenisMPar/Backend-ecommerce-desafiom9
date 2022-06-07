import { User } from "models/user";

export async function getUserData(userId) {
  //crea una instancia de user y trae la data desde la db
  const user = new User(userId);
  await user.pull();
  const userData = { ...user.data, id: userId };
  return userData;
}
