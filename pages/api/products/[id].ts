import type { NextApiRequest, NextApiResponse } from "next";

import { send } from "micro";
import methods from "micro-method-router";
import { getProductById } from "controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const id = req.query.id as string;
    try {
      const product = await getProductById(id);
      return send(res, 200, product);
    } catch (error) {
      return send(res, error.status, { message: error.message });
    }
  },
});
