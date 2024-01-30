import { FINISHED, OUT_FOR_DELIVERY } from "../../data/orderStatus.js";
import OrdersModel from "../../models/orders.js";
import { addDeliverymanObserver } from "../../obsevers/deliverymans.js";

export default async function deliverymanWSController(ws, req) {
  const { userID } = req.params;

  const observer = addDeliverymanObserver(userID);

  observer.on("requestOrderID", async (orderID) => {
    const order = await OrdersModel.getByID(orderID);
    observer.requestOrderID = orderID;
    ws.send(
      JSON.stringify({
        orderRequest: order,
      })
    );
  });

  ws.on("message", async (rawData) => {
    const data = JSON.parse(rawData);

    if (data.action === "ACCEPT") {
      observer.orderID = observer.requestOrderID;
      observer.requestOrderID = null;

      await OrdersModel.setDeliveryman(observer.orderID, userID);

      observer.emit("accept");
    }

    if (data.action === "REFUSE") {
      observer.requestOrderID = null;
      observer.emit("refuse");
    }

    if (data.action === "OUT_FOR_DELIVERY") {
      await OrdersModel.updateStatus(observer.orderID, OUT_FOR_DELIVERY);
      observer.emit("deliverymanOutForDelivery", observer.orderID);
    }

    if (data.action === "FINISHED") {
      await OrdersModel.updateStatus(observer.orderID, FINISHED);
      observer.emit("orderFinished", observer.orderID);
      observer.orderID = null;
    }
  });

  ws.on("close", () => {
    onlineDeliverymans.delete(userID);
  });
}
