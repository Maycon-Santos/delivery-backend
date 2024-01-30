import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../data/config.js";

// Responsável pela autenticação e recuperação dos dados do cliente logado
export default function authMiddleware(req, res, next) {
  // Recupera o token do header da requisição
  // Substuindo o "Bearer " por "" (vazio) para termos o token puro
  // Ex: de: Bearer dfsdf... para: dfsdf...
  const token = req.headers.authorization.replace("Bearer ", "");

  try {
    // Tenta a decodificação do token, caso não consiga, cai no catch
    // Caso consiga decodificar o token, teremos um objeto com os dados do cliente logado
    const dedodedToken = jwt.verify(token, SECRET_KEY);

    // Injeta o id e userType (store, delivaryman ou consumer) no objeto params da requisição
    req.params.userID = dedodedToken.data.id;
    req.params.userType = dedodedToken.data.userType;

    next();
  } catch (err) {
    console.error(err);

    // Responde para o cliente que o token não é válido
    res.send({
      success: false,
      message: "invalid token.",
    });
  }
}
