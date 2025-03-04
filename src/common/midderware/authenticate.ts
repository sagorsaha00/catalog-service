import { expressjwt, GetVerificationKey } from "express-jwt";

import config from "config";
import { Request } from "express";

import { expressJwtSecret } from "jwks-rsa";
import { authcookie } from "../types";

export default expressjwt({
  secret: expressJwtSecret({
    jwksUri: config.get("jwks.url"),
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.split("")[1] !== "undefined") {
      const token = authHeader.split("")[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as authcookie;
    return accessToken;
  },
});
