import sql from "../db/conn.js";

// "orders_items" tem uma relação de pedido e items
// Passamos o id do pedido para cada item que estiver no pedido

export default class OrdersItemsModel {
  // Salva o pedido na tabela "orders_items"
  static async save(orderID, itemID) {
    await sql`
    INSERT INTO orders_items (order_id, item_id) VALUES (${orderID}, ${itemID})
    `;
  }

  // Recupera o pedido pelo id
  static async getByOrderID(orderID) {
    const items = await sql`
      SELECT * FROM orders_items WHERE order_id = ${orderID}
    `;

    return items;
  }
}
