import { sendCode } from "controllers/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { send } from "micro";
import methods from "micro-method-router";
import * as yup from "yup";
import { schemaMiddleware } from "lib/middlewares";

let bodySchema = yup.object().shape({
  email: yup.string().email().required(),
});

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const auth = await sendCode(req.body.email);
    return send(res, 200, { Message: auth });
  } catch (error) {
    return send(res, 400, { error });
  }
}

const handler = methods({
  post: postHandler,
});

export default schemaMiddleware(bodySchema, handler);
