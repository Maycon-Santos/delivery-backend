import jwt from "jsonwebtoken";
import StoresModel from "../../models/stores.js";
import { compare } from "../../utils/encrypt.js";
import { SECRET_KEY } from "../../data/config.js";

export default async function loginStoreController(req, res) {
  const { cnpj, password } = req.body;

  const store = await StoresModel.getByCNPJ(cnpj);

  if (!(await compare(password, store.password))) {
    res.send({
      success: false,
      message: "CNPJ is wrong.",
    });
    return;
  }

  const token = jwt.sign(
    { data: { id: store.id, userType: "store" } },
    SECRET_KEY
  );

  res.send({ token });
}
