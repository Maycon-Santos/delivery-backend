import MenusModel from "../../models/menus.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function addMenuController(req, res) {
  // Recupera o valor da chave "name" do objeto "req.body"
  // "req.body" é o corpo da requisição que o usuário está fazendo
  const { name } = req.body;
  // Recuperando o id do usuário representado por "storeID"
  // O id do usuário que foi injetado pelo middleware "authMiddleware"
  const storeID = req.params.userID;

  if (name.length < 5) {
    sendError(res, 403, "Name must contain at least 5 characters.");
    return;
  }

  await MenusModel.save(storeID, name);

  res.send();
}
