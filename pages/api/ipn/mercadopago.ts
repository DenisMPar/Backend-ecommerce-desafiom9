import { orderPaymentNotification } from "controllers/orders";
import type { NextApiRequest, NextApiResponse } from "next";

//WebHook que checkea el estado de una orden de compra
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  if (topic == "merchant_order") {
    const check = await orderPaymentNotification(id as string);
    console.log(check);
  }
  res.send("ok");
}
