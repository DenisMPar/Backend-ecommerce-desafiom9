import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import methods from "micro-method-router";
import { getUserData, patchUserData } from "controllers/users";
import * as yup from "yup";

//endpoint que devuelve la data del user

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const data = await getUserData(userData.userId);
  return res.send(data);
}

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().notRequired(),
    name: yup.string(),
    address: yup.string(),
    phone: yup.number(),
  })
  .required()
  .noUnknown(true)
  .strict();
async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const data = req.body;
  const user = await patchUserData({ userId: userData.userId, data });
  res.send(user);
}
const patchHandlerValidated = schemaMiddleware(bodySchema, patchHandler);
const handler = methods({
  get: getHandler,
  patch: patchHandlerValidated,
});

export default authMiddleware(handler);
