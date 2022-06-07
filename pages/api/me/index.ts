import { User } from "models/user";
import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { send } from "micro";
import methods from "micro-method-router";
import { getUserData } from "controllers/users";

//endpoint que devuelve la data del user

async function getHandler(req: NextApiRequest, res: NextApiResponse, userData) {
  const data = await getUserData(userData.userId);
  return res.send(data);
}

async function patchHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userData
) {}

const handler = methods({
  get: getHandler,
  patch: patchHandler,
});

export default authMiddleware(handler);