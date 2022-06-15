import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jwt";
import * as yup from "yup";

//middleware que autentica el token
export function authMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = parseBearerToken(req);
    if (!token) {
      return res.status(401).send({ message: "No hay token" });
    }
    const decodedToken = decode(token);

    if (decodedToken) {
      return callback(req, res, decodedToken);
    } else {
      res.status(401).send({ message: "Token incorrecto" });
    }
  };
}

export function schemaMiddleware(schema: yup.AnyObjectSchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, userData) {
    if (req.body.email || req.body.name) {
      try {
        await schema.validate(req.body);
        return callback(req, res, userData);
      } catch (error) {
        return res.status(400).send({ message: error });
      }
    } else {
      return res.status(400).send({ message: "Debes enviar datos en el body" });
    }
  };
}
// export function schemaWithAutenticationMiddleware(
//   schema: yup.AnyObjectSchema,
//   callback
// ) {
//   return async function (req: NextApiRequest, res: NextApiResponse, userData) {
//     try {
//       await schema.validate(req.body);
//     } catch (error) {
//       return res.status(400).send({ message: error });
//     }
//     console.log("pass");
//     return callback(req, res, userData);
//   };
// }
