import sql from "../db/conn.js";

export default class OrdersModel {
  static async getByID(id) {
    const orders = await sql`
      SELECT * FROM orders WHERE id = ${id}
    `;

    return orders[0];
  }

  static async getAllByUserID(userID) {
    const orders = await sql`
      SELECT * FROM orders WHERE user_id = ${userID}
    `;

    return orders;
  }

  static async updateStatus(orderID, status) {
    await sql`
      UPDATE orders SET status = ${status} WHERE id = ${orderID}
    `;
  }

  static async setDeliveryman(orderID, deliverymanID) {
    await sql`
      UPDATE orders SET deliveryman_id = ${deliverymanID} WHERE id = ${orderID}
    `;
  }

  static async save(userID, status, storeID) {
    const result = await sql`
      INSERT INTO orders (
        user_id,
        store_id,
        date,
        status
      ) VALUES (
        ${userID},
        ${storeID},
        now(),
        ${status}
      ) RETURNING id
    `;

    return result[0];
  }
}
