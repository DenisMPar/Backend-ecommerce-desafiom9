import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/orders";
import type { NextApiRequest, NextApiResponse } from "next";

//WebHook que checkea el estado de una orden de compra
export default async function (req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;

  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    //si la orden de MP tiene el status paid, modifico la orden interna de la db y notifico al user del pago exitoso
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const myOrder = new Order(orderId);
      await myOrder.pull();
      myOrder.data.status = "closed";
      await myOrder.push();
      console.log("compra exitosa");

      //send email "tu compra fue exitosa"
      //email interno "alguien realizo una compra"
    }
  }
  res.send("ok");
}
