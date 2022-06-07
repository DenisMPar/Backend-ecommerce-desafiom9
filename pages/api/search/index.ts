import type { NextApiRequest, NextApiResponse } from "next";
import { getLimitAndOffsetFromReq } from "lib/request";
import methods from "micro-method-router";
import { searchProducts } from "controllers/products";

module.exports = methods({
  async get(req: NextApiRequest, res: NextApiResponse) {
    const { offset, limit } = getLimitAndOffsetFromReq(req);
    const results = await searchProducts(req.query.q as string, limit, offset);

    res.send(results);
  },
});
