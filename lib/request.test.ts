import { getLimitAndOffsetFromReq } from "./request";
import type { NextApiRequest } from "next";
import test from "ava";
const obj = {
  query: {
    limit: "100",
    offset: "20",
  },
} as any;

const req = obj as NextApiRequest;

test("request get-offset-and-Limit", (t) => {
  const payloadLimit = 100;
  const payloadOffset = 20;
  const { limit, offset } = getLimitAndOffsetFromReq(req);

  t.is(limit, payloadLimit);
  t.is(offset, payloadOffset);
});
