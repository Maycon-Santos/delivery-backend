import ItemsModel from "../../models/items.js";
import OrdersModel from "../../models/orders.js";
import OrdersItemsModel from "../../models/orders_items.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function getOrderController(req, res) {
  // Recupera o id do usuário e o id do pedido do "req.params"
  const { userID, order_id: orderID } = req.params;

  // Busca o pedido no banco
  const order = await OrdersModel.getByID(orderID);

  // Se o pedido não existir
  if (!order) {
    // Responde a mensagem que pedido não existe
    sendError(res, 404, "Order dos not exists.");
    return;
  }

  // Verifica se o pedido pertence ao usuário solicitante
  if (order.user_id !== userID) {
    // Responde a mensagem que o pedido não pertence ao usuário logado
    sendError(res, 403, `This request does not belong to user ${userID}`);
    return;
  }

  // Recupera todos os itens do pedido
  const orderItems = await OrdersItemsModel.getByOrderID(order.id);

  // Recupera todos os itens do banco e cria um array com suas informações
  const items = await Promise.all(
    orderItems.map(
      async (orderItem) => await ItemsModel.getByID(orderItem.item_id)
    )
  );

  res.send({
    success: true,
    result: {
      status: order.status,
      items,
    },
  });
}
