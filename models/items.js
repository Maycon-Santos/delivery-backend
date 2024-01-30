import sql from "../db/conn.js";

export default class ItemsModel {
  // Responsável por inserir uma nova linha no banco
  static async save(name, price, menuID) {
    await sql`
      INSERT INTO items (
        name,
        price,
        menu_id
      ) VALUES (
        ${name},
        ${price},
        ${menuID}
      )
    `;
  }

  // Responsável por ler uma linha do banco
  // Busca a linha pelo id
  static async getByID(id) {
    const items = await sql`
      SELECT * FROM items WHERE id = ${id}
    `;

    return items[0];
  }

  // Responsável por deletar uma linha do banco
  // Deleta a linha pelo id
  static async deleteByID(id) {
    await sql`
      DELETE FROM items WHERE id = ${id}
    `;
  }

  // Responsável por deletar uma linha do banco
  // Deleta todas as linhas que tem o id do menu passado
  static async deleteByMenuID(menuID) {
    await sql`
      DELETE FROM items WHERE menu_id = ${menuID}
    `;
  }

  // Responsável por buscar todas as linhas do banco pelo "menu_id"
  static async getAllByMenuID(menuID) {
    return await sql`
      SELECT * FROM items WHERE menu_id = ${menuID}
    `;
  }
}
