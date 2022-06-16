import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { getUserOrders } from "controllers/orders";

//endpoint que devuelve la data del user

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const orders = await getUserOrders(userData.userId);
  return res.send(orders);
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
