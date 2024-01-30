import isEmail from "validator/lib/isEmail.js";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import DeliveryManModel from "../../models/deliveryman.js";
import { encrypt } from "../../utils/encrypt.js";

export default async function registerDeliveryManController(req, res) {
  const { email, password, cpf } = req.body;

  if (!isEmail(email)) {
    res.send({
      success: false,
      message: "Email is invalid.",
    });
    return;
  }

  const deliveryManByEmail = await DeliveryManModel.getByEmail(email);

  if (Boolean(deliveryManByEmail)) {
    res.send({
      success: false,
      message: "Email is already in use.",
    });
    return;
  }

  if (password.length < 6) {
    res.send({
      success: false,
      message: "Password must contain at least 6 characters.",
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

  if (!cpfValidator.isValid(String(cpf))) {
    res.send({
      success: false,
      message: "CPF is invalid.",
    });
    return;
  }

  const deliverymanByCPF = await DeliveryManModel.getByCPF(cpf);

  if (Boolean(deliverymanByCPF)) {
    res.send({
      success: false,
      message: "CPF is already in use.",
    });
    return;
  }

  await DeliveryManModel.save(email, await encrypt(password), cpf);

  res.send();
}
