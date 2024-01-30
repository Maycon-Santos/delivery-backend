import MenusModel from "../../models/menus.js";
import { PREPARING } from "../../data/orderStatus.js";
import ItemsModel from "../../models/items.js";
import OrdersModel from "../../models/orders.js";
import OrdersItemsModel from "../../models/orders_items.js";
import UsersModel from "../../models/users.js";
import { getDeliverymanObserverByID } from "../../obsevers/deliverymans.js";
import { getStoreObserverByID } from "../../obsevers/stores.js";

export default async function consumerWSController(ws, req) {
  const { userID } = req.params;

  ws.on("message", async (rawData) => {
    const data = JSON.parse(rawData);
    const { action, items_id: itemsID } = data;

    if (action === "CREATE_ORDER") {
      // Vai recuperar o usuário pelo id
      const user = await UsersModel.getByID(userID);

      // Se usuário não existir
      if (!user) {
        // Responde a mensagem que usuário não existe
        ws.send("User id does not exists.");
        ws.close();
        return;
      }

      // Pega o id do primeiro item
      const firstItem = await ItemsModel.getByID(itemsID[0]);
      // Pega o menu do item
      const firstItemMenu = await MenusModel.getByID(firstItem.menu_id);
      // Recupera o id da loja desse menu
      const storeID = firstItemMenu.store_id;

      // Salva o pedido no banco com o status "PREPARING (preparando)"
      const order = await OrdersModel.save(userID, PREPARING, storeID);

      // Inserir na tabela "orders_items" a relação de pedidos e items
      await Promise.all(
        itemsID.map(async (itemID) => {
          await OrdersItemsModel.save(order.id, itemID);
        })
      );

      const storeObserver = getStoreObserverByID(storeID);

      storeObserver.on("foundDeliveryman", async () => {
        ws.send("Encontrou um entregador.");

        const updatedOrder = await OrdersModel.getByID(order.id);
        const deliverymanObserver = getDeliverymanObserverByID(
          updatedOrder.deliveryman_id
        );

        deliverymanObserver.on("deliverymanOutForDelivery", (orderID) => {
          ws.send(`Entregador a caminho: ${orderID}`);
        });

        deliverymanObserver.on("orderFinished", (orderID) => {
          ws.send(`Pedido entregue: ${orderID}`);
        });
      });

      storeObserver.emit("createdOrder", order.id);
    }
  });
}
