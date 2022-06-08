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
    return preference.init_point;
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
    console.log(myOrder);

    const mail = {
      message: `Tu pago ha sido acreditado`,
      from: process.env.SENDGRID_EMAIL,
      to: myOrder.data.user.email,
      subject: "Pago exitoso",
    };

    await sendMail(mail);

    return "compra exitosa";

    //send email "tu compra fue exitosa"
    //email interno "alguien realizo una compra"
  } else {
    return false;
  }
}
