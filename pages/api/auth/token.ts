import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
import { checkUserCode } from "controllers/auth";

//endpoint que genera un token de usuario
export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await checkUserCode(req.body.email, req.body.code);
    res.send({ token });
  } catch (error) {
    res.status(400).send({ messagge: error });
  }
  // const auth = await Auth.FindByEmailAndCode(req.body.email, req.body.code);
  // if (!auth) {
  //   return res.status(401).send({ message: "Código o email incorrectos" });
  // }
  // const validCode = auth.isCodeValid();
  // if (validCode) {
  //   const token = generate({ userId: auth.data.userId });
  //   res.send({ token });
  // } else {
  //   res.status(401).send({ message: "Código expirado" });
  // }
}
