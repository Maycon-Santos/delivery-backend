import sql from "../db/conn.js";

export default class UsersModel {
  static async getByID(id) {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;

    return users[0];
  }

  static async getByEmail(email) {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    return users[0];
  }

  static async checkEmailExists(email) {
    const users = await sql`
      SELECT FROM users WHERE email = ${email}
    `;

    return users.length > 0;
  }

  static async checkCpfExists(cpf) {
    const users = await sql`
      SELECT FROM users WHERE cpf = ${cpf}
    `;

    return users.length > 0;
  }

  static async save(email, password, cpf) {
    await sql`
      INSERT INTO users (email, password, cpf) VALUES (${email}, ${password}, ${cpf})
    `;
  }
}
