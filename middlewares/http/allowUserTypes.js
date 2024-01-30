import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../data/config.js";

export default function allowUserTypesMiddleware(...allowedUserTypes) {
  return (req, res, next) => {
    // Recupera o token do header da requisição
    // Substuindo o "Bearer " por "" (vazio) para termos o token puro
    // Ex: de: Bearer dfsdf... para: dfsdf...
    const token = req.headers.authorization.replace("Bearer ", "");

    try {
      // Tenta a decodificação do token, caso não consiga, cai no catch
      // Caso consiga decodificar o token, teremos um objeto com os dados do cliente logado
      const dedodedToken = jwt.verify(token, SECRET_KEY);
      const userType = dedodedToken.data.userType;

      if (allowedUserTypes.includes(userType)) {
        next();
      } else {
        res.status(403);
        res.send({
          success: false,
          messgae: "Access denied.",
        });
      }
    } catch (err) {
      console.error(err);

      res.send({
        success: false,
        message: "invalid token.",
      });
    }
  };
}
