import ItemsModel from "../../models/items.js";
import MenusModel from "../../models/menus.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function addItemsController(req, res) {
  // "items" é um array de itens para que a loja possa adicionar vários itens de uma vez
  const { items, menu_id } = req.body;
  // Recuperando o id do usuário representado por "storeID"
  // O id do usuário que foi injetado pelo middleware "authMiddleware"
  const storeID = req.params.userID;

  // Recuperando o menu pelo id
  const menu = await MenusModel.getByID(menu_id);

  // Verificando se o menu existe
  if (!menu) {
    // Se não existir, responde para o cliente que o menu não existe
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

  // Cria um array de erros
  const errors = [];

  // Percorre todos os items do array "items"
  // Cada item é representado pelo parâmetro "item"
  items.forEach(async (item) => {
    // Desestruturando o item, recuperando "name" e "price" do objeto e criando uma constante com o mesmo nome
    const { name, price } = item;

    // Verifica se o nome do item está vazio
    if (name === "") {
      // Insere no array de erros a mensagem e o objeto item
      errors.push({
        item,
        message: "The product needs to have a name.",
      });
      return;
    }

    // Se o preço for menor ou igual a 0
    if (price <= 0) {
      // Insere no array de erros a mensagem e o objeto item
      errors.push({
        item,
        message: "Price must be greater than 0",
      });
      return;
    }

    // Caso chegue até aqui, insere no banco com os dados necessários para a linha da tabela "items"
    await ItemsModel.save(name, price, menu_id);
  });

  if (errors.length > 0) {
    sendError(
      res,
      403,
      errors.map((error) => ({
        item: error.item,
        message: error.message,
      }))
    );
    return;
  }

  res.send();
}
