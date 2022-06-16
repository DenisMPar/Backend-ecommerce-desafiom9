import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getOrderById } from "controllers/orders";
import methods from "micro-method-router";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
  const { orderId } = req.query as any;
  try {
    const orderData = await getOrderById(orderId);
    res.send(orderData);
  } catch (error) {
    res.send({ message: error });
  }
}

const handler = methods({
  get: getHandler,
});

export default authMiddleware(handler);
