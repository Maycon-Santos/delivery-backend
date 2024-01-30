import { cnpj as cnpjValidator } from "cpf-cnpj-validator";
import StoresModel from "../../models/stores.js";
import { encrypt } from "../../utils/encrypt.js";

export default async function registerStoreController(req, res) {
  const { name, cnpj, password } = req.body;

  if (!cnpjValidator.isValid(String(cnpj))) {
    res.send({
      success: false,
      message: "CNPJ is invalid.",
    });
    return;
  }

  const store = await StoresModel.getByCNPJ(cnpj);

  if (Boolean(store)) {
    res.send({
      success: false,
      message: "CNPJ already exists.",
    });
    return;
  }

  if (name.length < 6) {
    res.send({
      success: false,
      message: "Name must be longer than 5 characters.",
    });
    return;
  }

  if (password.length < 5) {
    res.send({
      success: false,
      message: "Passord must have at least 6 characters.",
    });
    return;
  }

  if (password.length > 25) {
    res.send({
      success: false,
      message: "Password must have a maximum of 25 characters.",
    });
    return;
  }

  await StoresModel.save(name, cnpj, await encrypt(password));

  res.send();
}
