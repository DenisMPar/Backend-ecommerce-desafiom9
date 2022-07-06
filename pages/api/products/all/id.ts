import type { NextApiRequest, NextApiResponse } from "next";

import { send } from "micro";
import methods from "micro-method-router";
import { getAllProductsId, getProductById } from "controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const ids = await getAllProductsId();
    return send(res, 200, ids);
  },
});
