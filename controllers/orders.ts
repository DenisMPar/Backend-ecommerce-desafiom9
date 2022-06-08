import { getMerchantOrder } from "lib/mercadopago";
import { Order } from "models/orders";

export async function generateOrder(data) {
  //creo una orden de compra con estado pendiente
  const order = await Order.createNewOrder({
    ...data,
    status: "pending",
    createdAt: new Date(),
  });
  return order;
}

export async function orderPaymentNotification(id) {
  const order = await getMerchantOrder(id);
  //si la orden de MP tiene el status paid, modifico la orden interna de la db y notifico al user del pago exitoso
  if (order.order_status == "paid") {
    const orderId = order.external_reference;
    const myOrder = new Order(orderId);
    await myOrder.pull();
    myOrder.data.status = "closed";
    await myOrder.push();
    console.log("compra exitosa");
    return true;

    //send email "tu compra fue exitosa"
    //email interno "alguien realizo una compra"
  } else {
    return false;
  }
}
