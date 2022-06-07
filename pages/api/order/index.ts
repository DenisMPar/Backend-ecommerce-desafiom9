import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserData } from "controllers/users";
import { generateOrder } from "controllers/orders";
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
  const data = req.body;

  //debo checkear si existe el producto en la db
  const product = products[productId];
  if (!product) {
    return res.status(400).send({ messagge: "El producto no existe" });
  }
  //traigo la data del user para sumarla a la orden de compra
  const user = await getUserData(userData.userId);

  //creo la orden en la db con la data del producto y del user
  const orderData = { user, productData: product, additionalInfo: data };
  const order = await generateOrder(orderData);

  //un vez creada la orden genero la preferencia en mercadoPago
  const preference = await generatePreference(order.data.productData, order.id);

  //retorno el url de pago
  res.send({ url: preference.init_point });
}

const handler = methods({
  post: postHandler,
});

export default authMiddleware(handler);
