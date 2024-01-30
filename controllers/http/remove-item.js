import ItemsModel from "../../models/items.js";
import MenusModel from "../../models/menus.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function removeItemController(req, res) {
  // Recupera o id do item passado pela url
  const { item_id } = req.params;
  const storeID = req.params.userID;

  // Recupera o item pelo id
  const item = await ItemsModel.getByID(item_id);

  // Verifica se o item existe
  if (!item) {
    sendError(res, 404, "Item does not exist.");
    return;
  }

  // Recupera o id do menu que é a coluna "menu_id" da tabela "items"
  // Passa o id do menu para o método que vai buscar o menu pelo id
  const menu = await MenusModel.getByID(item.menu_id);

  // menu.store_id é a coluna "store_id" da tabela menus
  // store_id representa o id da loja que é dona do menu
  // Se o "store_id" for diferente de "storeID", significa que a loja que está logada não é dona do menu
  if (menu.store_id !== storeID) {
    sendError(res, 403, "This menu does not belong to this store.");
    return;
  }

  // Caso chegue até aqui, deleta a linha da tabela "items" com o id passado pelos parâmetros
  await ItemsModel.deleteByID(item_id);

  res.send();
}
