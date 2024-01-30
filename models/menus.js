import sql from "../db/conn.js";

export default class MenusModel {
  // Responsável por inserir uma nova linha no banco
  static async save(storeID, name) {
    await sql`
      INSERT INTO menus (store_id, name) VALUES (${storeID}, ${name})
    `;
  }

  // Responsável por ler uma linha do banco
  // Busca a linha pelo id
  static async getByID(id) {
    const menus = await sql`
      SELECT * FROM menus WHERE id = ${id}
    `;

    return menus[0];
  }

  // Responsável por deletar uma linha do banco
  // Deleta a linha pelo id
  static async deleteByID(id) {
    await sql`
      DELETE FROM menus WHERE id = ${id}
    `;
  }

  // Responsável por buscar todas as linhas do banco pelo "store_id"
  static async getAllByStoreID(storeID) {
    return await sql`
      SELECT * FROM menus WHERE store_id = ${storeID}
    `;
  }
}
