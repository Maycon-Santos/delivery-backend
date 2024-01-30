import ItemsModel from "../../models/items.js";
import MenusModel from "../../models/menus.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function removeMenuController(req, res) {
  // Recupera o valor da chave "menu_id" do objeto "req.params"
  // "req.params" é o parâmetro que o servidor recebe da url
  const { menu_id } = req.params;
  // Recuperando o id do usuário representado por "storeID"
  // O id do usuário que foi injetado pelo middleware "authMiddleware"
  const storeID = req.params.userID;

  // Vai buscar o menu pelo id passado pelo parâmetro "menu_id"
  const menu = await MenusModel.getByID(menu_id);

  // Se não retornar menu, significa que ele não existe
  if (!menu) {
    // Envia para o cliente que esse menu não existe
    sendError(res, 404, "Menu does not exist.");
    return;
  }

  // menu.store_id é a coluna "store_id" da tabela menus
  // store_id representa o id da loja que é dona do menu
  // Se o "store_id" for diferente de "storeID", significa que a loja que está logada não é dona do menu
  if (menu.store_id !== storeID) {
    sendError(res, 403, "This menu does not belong to this store.");
    return;
  }

  // Vai deletar todos os items que pertencem ao menu
  // Isso deve ser feito, pois não podemos deletar um menu tendo items referenciando o id dele
  await ItemsModel.deleteByMenuID(menu_id);
  // Deletar o menu pelo id
  await MenusModel.deleteByID(menu_id);

  res.send();
}
