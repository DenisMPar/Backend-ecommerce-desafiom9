import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { send } from "micro";
import methods from "micro-method-router";
import { getUserOrders } from "controllers/orders";
import { Order } from "models/orders";

//endpoint que devuelve la data del user

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  console.log(userData.userId);

  const orders = await getUserOrders(userData.userId);
  return res.send(orders);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
