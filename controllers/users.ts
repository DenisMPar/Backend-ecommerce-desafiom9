import { User } from "models/user";

export async function getUserData(userId) {
  //crea una instancia de user y trae la data desde la db
  const user = new User(userId);
  await user.pull();
  const userData = { ...user.data, id: userId };
  return userData;
}
export async function patchUserData({ userId, data }) {
  const user = new User(userId);
  await user.pull();
  user.data = { ...user.data, ...data };
  await user.push();
  return user.data;
}
export async function patchUserAddressData({ userId, address, data }) {
  const user = new User(userId);
  await user.pull();
  user.data[address] = data[address];
  await user.push();
  return user.data;
}
