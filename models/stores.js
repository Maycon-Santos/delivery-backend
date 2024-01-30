import sql from "../db/conn.js";

export default class StoresModel {
  static async save(name, cnpj, password) {
    await sql`
      INSERT INTO stores (name, cnpj, password) VALUES (${name}, ${cnpj}, ${password})
    `;
  }

  static async getByCNPJ(cnpj) {
    const stores = await sql`
      SELECT * FROM stores WHERE cnpj = ${cnpj}
    `;

    return stores[0];
  }

  static async getByID(id) {
    const stores = await sql`
      SELECT * FROM stores WHERE id = ${id}
    `;

    return stores[0];
  }

  static async getAll() {
    const stores = await sql`
      SELECT * FROM stores
    `;

    return stores;
  }
}
