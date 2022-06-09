import { generatePreference, getMerchantOrder } from "lib/mercadopago";
import { sendMail } from "lib/sendgrid";
import { Order } from "models/orders";
import { getProductById } from "./products";
import { getUserData } from "./users";

export async function generateOrder(data) {
  //creo una orden de compra con estado pendiente
  const order = await Order.createNewOrder({
    ...data,
    status: "pending",
    createdAt: new Date(),
  });
  return order;
}

export async function getOrderById(id) {
  const order = new Order(id);
  await order.pull();

  return order.data;
}
export async function getUserOrders(userId) {
  const userOrders = await Order.getUserOrdersById(userId);
  return userOrders;
}

export async function orderProductById({ productId, userId }) {
  const product = await getProductById(productId);

  if (!product) {
    throw "El producto no existe";
  }

  try {
    const user = await getUserData(userId);
    const orderData = { user, productData: product };
    const order = await generateOrder(orderData);

    //un vez creada la orden genero la preferencia en mercadoPago
    const preference = await generatePreference(product, order.id);

    //retorno el url de pago
    return { url: preference.init_point, orderId: order.id };
  } catch (error) {
    return error;
  }

  //creo la orden en la db con la data del producto y del user
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
    const mail = {
      message: `Tu pago de $${myOrder.data.Price} por la compra de ${myOrder.data.Name} ha sido acreditado, gracias por tu compra`,
      from: process.env.SENDGRID_EMAIL,
      to: myOrder.data.user.email,
      subject: "Pago exitoso",
    };

    await sendMail(mail);
    const mail2 = {
      message: `Se recibio un pago de $${myOrder.data.Price} por la compra de ${myOrder.data.Name}, numero de orden ${myOrder.id} `,
      from: process.env.SENDGRID_EMAIL,
      to: "ecommerce@ventas.com",
      subject: "Pago exitoso",
    };
    await sendMail(mail2);
    return "compra exitosa";
  } else {
    return false;
  }
}
