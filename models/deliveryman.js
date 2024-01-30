import sql from "../db/conn.js";

export default class DeliveryManModel {
  static async save(email, password, cpf) {
    await sql`
      INSERT INTO deliverymans (
        email,
        password,
        cpf
      ) VALUES (
        ${email},
        ${password},
        ${cpf}
      )
    `;
  }

  static async getByEmail(email) {
    const result = await sql`
      SELECT * FROM deliverymans WHERE email = ${email}
    `;

    return result[0];
  }

  static async getByCPF(cpf) {
    const result = await sql`
      SELECT * FROM deliverymans WHERE cpf = ${cpf}
    `;

    return result[0];
  }
}
