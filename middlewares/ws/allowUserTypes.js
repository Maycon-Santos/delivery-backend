import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../data/config.js";

export default function allowUserTypesMiddlewareWs(...allowedUserTypes) {
  return (ws, req, next) => {
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
      const dedodedToken = jwt.verify(token, SECRET_KEY);
      const userType = dedodedToken.data.userType;

      if (allowedUserTypes.includes(userType)) {
        next();
      } else {
        ws.send("Access denied.");
        ws.close();
      }
    } catch (err) {
      console.error(err);

      ws.send("invalid token.");
      ws.close();
    }
  };
}
