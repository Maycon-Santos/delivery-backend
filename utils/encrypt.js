import bcrypt from "bcrypt";

const saltRounds = 10;

export async function encrypt(data) {
  return await bcrypt.hash(data, saltRounds);
}

export async function compare(data, encrypted) {
  return await bcrypt.compare(data, encrypted);
}
