import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware, schemaMiddleware } from "lib/middlewares";
import { patchUserAddressData } from "controllers/users";
import methods from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
  .object()
  .shape({
    email: yup.string().email().notRequired(),
    name: yup.string(),
  })
  .required()
  .noUnknown(true)
  .strict();

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { address } = req.query;
  const data = req.body;
  const userNewData = await patchUserAddressData({
    userId: userData.userId,
    address,
    data,
  });
  res.send(userNewData);
}

const patchHandlerValidated = schemaMiddleware(bodySchema, patchHandler);
const handler = methods({
  patch: patchHandlerValidated,
});

export default authMiddleware(handler);
