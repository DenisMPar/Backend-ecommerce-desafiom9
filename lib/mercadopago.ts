import mercadopago from "mercadopago";
import { Currency } from "mercadopago/shared/currency";

mercadopago.configure({
  access_token: process.env.MP_TOKEN,
});

//Busca una merchant order en Mp
export async function getMerchantOrder(id) {
  const res = await mercadopago.merchant_orders.get(id);
  return res.response;
}

//genero una preferencia de pago con la data del producto
export async function generatePreference(productData, orderId) {
  //guardo la info que necesita Mp para crear la preferencia
  //mockeo algunos valores para que funcione ya que los productos en la db todavia no tienen toda la info
  const preferenceData = {
    items: [
      {
        title: productData.title,
        description: "La mejor merch de la web",
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "152984",
        quantity: 1,
        currency_id: "ARS" as Currency,
        unit_price: productData.price,
      },
    ],
    back_urls: {
      succes: "https://apx.school",
      pending: "https://apx.school/pending",
    },
    external_reference: orderId,
    notification_url: "https://pagos-rouge.vercel.app/api/webhooks/mercadopago",
  };

  const res = await mercadopago.preferences.create(preferenceData);
  return res.response;
}
