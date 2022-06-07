import type { NextApiRequest } from "next";

//establece los limit y offset maximos y por defecto
export function getLimitAndOffsetFromReq(
  req: NextApiRequest,
  maxLimit = 100,
  maxOffset = 10000
) {
  const queryLimit = parseInt(req.query.limit as string);
  const queryOffset = parseInt(req.query.offset as string);
  const limit = queryLimit
    ? queryLimit < maxLimit
      ? queryLimit
      : maxLimit
    : 10;
  const offset = queryOffset ? (queryOffset < maxOffset ? queryOffset : 0) : 0;

  return {
    limit,
    offset,
  };
}
