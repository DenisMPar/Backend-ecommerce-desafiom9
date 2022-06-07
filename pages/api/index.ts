import type { NextApiRequest, NextApiResponse } from "next";

//endpoint que genera un token de usuario
export default async function (req: NextApiRequest, res: NextApiResponse) {
  res.status(200).send({
    message: "Bienvenido a la api de e-commerce",
  });
}
