import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData } from "controllers/users";
import { generateOrder, orderProductById } from "controllers/orders";
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

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { productId } = req.query as any;
  try {
    const response = await orderProductById({
      productId,
      userId: userData.userId,
    });
    res.send(response);
  } catch (error) {
    res.send({ message: error });
  }
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);
