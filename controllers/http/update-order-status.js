import { STORE_ALLOWED_STATUS } from "../../data/orderStatus.js";
import OrdersModel from "../../models/orders.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function updateOrderStatusController(req, res) {
  // Recuperando o id do pedido e o status que o usuário deseja atualizar
  const { order_id: orderID, status } = req.body;
  // Recuperando o id e o tipo do usuário pelo "req.params"
  const { userID, userType } = req.params;

  // Recuperar o pedido do banco
  const order = await OrdersModel.getByID(orderID);

  // Verificar se o pedido existe
  if (!order) {
    // Responde a mensagem que o pedido não existe
    sendError(res, 404, "Order not exists.");
    return;
  }

  // Verifica se o tipo de usuário é "store (loja)"
  if (userType === "store") {
    // Inicia o fluxo da loja

    // Se o pedido não pertence a loja
    if (order.store_id !== userID) {
      // Responde a mensagem que o pedido não pertence a loja
      sendError(res, 404, "Order does not belong to this store.");
      return;
    }

    // Verifica se o status que vai ser inserido não está na lista de status permitidos para loja
    if (!STORE_ALLOWED_STATUS.includes(status)) {
      sendError(
        res,
        404,
        `The store is not allowed to change the status to ${status}.`
      );
      return;
    }

    // Verifica se o status atual do pedido é um status que está na lista de status permitidos para loja
    if (!STORE_ALLOWED_STATUS.includes(order.status)) {
      sendError(res, 404, `The store can no longer change status.`);
      return;
    }
    // Se não for "store (loja)", mas for "deliveryman (entregador)"
  } else if (userType === "deliveryman") {
    // Iniciar o fluxo do entregador

    // Verifica se o pedido está com o entregador
    if (order.deliveryman_id !== userID) {
      sendError(res, 404, "Order does not belong to this deliveryman.");
      return;
    }

    // Verifica se o status que vai ser inserido não está na lista de status permitidos para entregador
    if (!DELIVERYMAN_ALLOWED_STATUS.includes(status)) {
      sendError(
        res,
        404,
        `The deliveryman is not allowed to change the status to ${status}.`
      );
      return;
    }
    // Se não for "deliveryman (entregador)" nem "store (loja)"
  } else {
    // Responde com a mensagem que o usuário não está permitido alterar status
    sendError(res, 403, "User is not allowed to change status.");
    return;
  }

  // Atualiza o status no banco
  await OrdersModel.updateStatus(orderID, status);

  console.log(order);

  // Solicitar a entrega ao motoboy

  res.send();
}
