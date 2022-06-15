import test from "ava";
import { generate, decode } from "./jwt";

test("jwt decode-encode", (t) => {
  const payLoad = { mail: "user@mail" };
  const token = generate(payLoad);
  const result = decode(token);
  delete result.iat;

  t.deepEqual(payLoad, result);
});
