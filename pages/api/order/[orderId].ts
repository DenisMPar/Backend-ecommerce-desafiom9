import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData } from "controllers/users";
import {
  generateOrder,
  getOrderById,
  orderProductById,
} from "controllers/orders";
import { generatePreference } from "lib/mercadopago";
import methods from "micro-method-router";

//db mockeada
const products = {
  123: {
    title: "mouse para el marce",
    price: 100,
  },
  1234: {
    title: "teclado",
    price: 150,
  },
};

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
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
