import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
import { checkUserCode } from "controllers/auth";
import methods from "micro-method-router";
import { schemaMiddleware } from "lib/middlewares";
import * as yup from "yup";

let bodySchema = yup.object().shape({
  email: yup.string().email().required(),
  code: yup.number().required(),
});
//endpoint que genera un token de usuario
async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = await checkUserCode(req.body.email, req.body.code);
    res.send({ token });
  } catch (error) {
    res.status(400).send({ messagge: error });
  }
}

const handler = methods({
  post: postHandler,
});

export default schemaMiddleware(bodySchema, handler);
