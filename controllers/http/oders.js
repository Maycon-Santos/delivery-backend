import ItemsModel from "../../models/items.js";
import OrdersModel from "../../models/orders.js";
import OrdersItemsModel from "../../models/orders_items.js";
import StoresModel from "../../models/stores.js";

export default async function ordersController(req, res) {
  const { userID } = req.params;

  const orders = await OrdersModel.getAllByUserID(userID);

  const sanitizedOrders = await Promise.all(
    orders.map(async (order) => {
      const store = await StoresModel.getByID(order.store_id);
      const orderItems = await OrdersItemsModel.getByOrderID(order.id);
      const items = await Promise.all(
        orderItems.map(async (orderItem) => {
          const item = await ItemsModel.getByID(orderItem.item_id);

          return {
            id: item.id,
            name: item.name,
            price: item.price,
          };
        })
      );

      return {
        id: order.id,
        date: order.date,
        status: order.status,
        store_id: store.id,
        store_name: store.name,
        deliveryman_id: order.deliveryman_id,
        items,
      };
    })
  );

  res.send(sanitizedOrders);
}
