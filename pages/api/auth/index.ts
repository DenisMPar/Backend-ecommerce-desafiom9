import { sendCode } from "controllers/auth";
import type { NextApiRequest, NextApiResponse } from "next";
import { send } from "micro";
import methods from "micro-method-router";

module.exports = methods({
  //endpoint que da de alta o encuentra un user existente y le envia el codigo de login
  async post(req: NextApiRequest, res: NextApiResponse) {
    if (!req.body.email) {
      return send(res, 400, { message: "Debes enviar un mail en el body" });
    }
    try {
      const auth = await sendCode(req.body.email);
      return send(res, 200, { Message: auth });
    } catch (error) {
      return send(res, 400, { error });
    }
  },
});
