import type { NextApiRequest, NextApiResponse } from "next";
import {
  authMiddleware,
  querySchemaMiddleware,
  schemaMiddleware,
} from "lib/middlewares";
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
let querySchema = yup
  .string()
  .matches(/(email|name)/, "la url debe ser /email o /name");

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {
  const { address } = req.query;
  const data = req.body;

  if (data[address as string]) {
    const userNewData = await patchUserAddressData({
      userId: userData.userId,
      address,
      data,
    });
    res.send(userNewData);
  } else {
    res.status(400).send("los datos del body deben coincidir con la url");
  }
}

const patchHandlerValidated = querySchemaMiddleware(
  querySchema,
  schemaMiddleware(bodySchema, patchHandler)
);
const handler = methods({
  patch: patchHandlerValidated,
});

export default authMiddleware(handler);
