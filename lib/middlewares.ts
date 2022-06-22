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

//middleware que checkea el body
export function schemaMiddleware(schema: yup.AnyObjectSchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, userData) {
    //reviso si el body viene vacio
    if (Object.keys(req.body).length > 0) {
      try {
        //valido el body
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

//middleware que checkea el query
export function querySchemaMiddleware(schema: yup.StringSchema, callback) {
  return async function (req: NextApiRequest, res: NextApiResponse, userData) {
    //reviso si el query viene vacio
    if (Object.keys(req.query).length > 0) {
      try {
        //valido el query
        await schema.validate(req.query.address);
        return callback(req, res, userData);
      } catch (error) {
        return res.status(400).send({ message: error });
      }
    } else {
      return res
        .status(400)
        .send({ message: "Debes enviar datos en la query" });
    }
  };
}
