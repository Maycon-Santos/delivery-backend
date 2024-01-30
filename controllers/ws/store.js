import OrdersModel from "../../models/orders.js";
import { WAITING_FOR_DELIVERYMAN } from "../../data/orderStatus.js";
import {
  getDeliverymanObserverByID,
  getDeliverymansOnline,
} from "../../obsevers/deliverymans.js";
import { addStoreObserver } from "../../obsevers/stores.js";
import OrdersItemsModel from "../../models/orders_items.js";
import ItemsModel from "../../models/items.js";

export default function storeWSController(ws, req) {
  const { userID } = req.params;

  const storeObserver = addStoreObserver(userID);

  storeObserver.on("createdOrder", async (orderID) => {
    const order = await OrdersModel.getByID(orderID);

    if (!order) {
      ws.send("Order dos not exists.");
      ws.close();
    }

    if (order.store_id !== userID) {
      ws.send(`This request does not belong to store ${userID}`);
      ws.close();
    }
    const orderItems = await OrdersItemsModel.getByOrderID(order.id);

    const items = await Promise.all(
      orderItems.map(
        async (orderItem) => await ItemsModel.getByID(orderItem.item_id)
      )
    );

    ws.send(JSON.stringify({ id: order.id, items }));
  });

  storeObserver.on("createdOrder", function searchDeliveryman(orderID) {
    const deliverymanIDs = getDeliverymansOnline();
    const foundDeliverymanID = deliverymanIDs.find((deliverymanID) => {
      const deliverymanObserver = getDeliverymanObserverByID(deliverymanID);

      if (deliverymanObserver.requestOrderID !== null) {
        return false;
      }

      if (deliverymanObserver.orderID !== null) {
        return false;
      }

      return true;
    });

    if (!foundDeliverymanID) {
      setTimeout(() => {
        searchDeliveryman(orderID);
      }, 1000 * 60);
      return;
    }

    const deliverymanObserver = getDeliverymanObserverByID(foundDeliverymanID);

    const onAccept = async () => {
      await OrdersModel.updateStatus(orderID, WAITING_FOR_DELIVERYMAN);
      storeObserver.emit("foundDeliveryman");
      ws.send("Encontrou um entregador.");
    };

    const onRefuse = async () => {
      console.log("store:", "Recusou");

      deliverymanObserver.remove(onAccept);
      deliverymanObserver.remove(onRefuse);
      deliverymanObserver.remove(onOutForDelivery);
      deliverymanObserver.remove(finished);

      searchDeliveryman(orderID);
    };

    const onOutForDelivery = (orderID) => {
      ws.send(`Saiu para entrega: ${orderID}`);
    };

    const finished = (orderID) => {
      ws.send(`Pedido entregue: ${orderID}`);
    };

    deliverymanObserver.on("accept", onAccept);
    deliverymanObserver.on("refuse", onRefuse);
    deliverymanObserver.on("deliverymanOutForDelivery", onOutForDelivery);
    deliverymanObserver.on("orderFinished", finished);

    deliverymanObserver.emit("requestOrderID", orderID);
  });

  ws.on("message", async (rawData) => {
    const { action, ...data } = JSON.parse(rawData);

    if (action === "SEARCH_DELIVERYMAN") {
      const order = await OrdersModel.getByID(data.order_id);

      if (!order) {
        ws.send("Order does not exists.");
        ws.close();
      }
    }
  });
}
