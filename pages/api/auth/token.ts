import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";
import { checkUserCode } from "controllers/auth";
import methods from "micro-method-router";
//endpoint que genera un token de usuario

module.exports = methods({
  async post(req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = await checkUserCode(req.body.email, req.body.code);
      res.send({ token });
    } catch (error) {
      res.status(400).send({ messagge: error });
    }
  },
});
