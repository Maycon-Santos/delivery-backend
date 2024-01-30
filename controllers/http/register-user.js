import { cpf as cpfValidator } from "cpf-cnpj-validator";
import isEmail from "validator/lib/isEmail.js";
import UsersModel from "../../models/users.js";
import { encrypt } from "../../utils/encrypt.js";
import { sendError } from "../../utils/httpResponse.js";
import {
  CPF_IN_USE,
  EMAIL_IN_USE,
  INVALID_CPF,
  INVALID_EMAIL,
  PASSWORD_GREATER_THAN_MAXIMUM,
  PASSWORD_LESS_THAN_MINIMUM,
} from "../../data/errorTypes.js";

export default async function registerUserController(req, res) {
  const { email, password, cpf } = req.body;

  if (!isEmail(email)) {
    sendError(res, 401, "Email is invalid.", INVALID_EMAIL);
    return;
  }

  if (password.length < 5) {
    sendError(
      res,
      401,
      "Passord must have at least 6 characters.",
      PASSWORD_LESS_THAN_MINIMUM
    );
    return;
  }

  if (password.length > 25) {
    sendError(
      res,
      401,
      "Password must have a maximum of 25 characters.",
      PASSWORD_GREATER_THAN_MAXIMUM
    );
    return;
  }

  if (!cpfValidator.isValid(String(cpf))) {
    sendError(res, 401, "CPF is invalid.", INVALID_CPF);
    return;
  }

  if (await UsersModel.checkEmailExists(email)) {
    sendError(res, 401, "Email already exists.", EMAIL_IN_USE);
    return;
  }

  if (await UsersModel.checkCpfExists(cpf)) {
    sendError(res, 401, "CPF already exists.", CPF_IN_USE);
    return;
  }

  await UsersModel.save(email, await encrypt(password), cpf);

  res.send({
    success: true,
  });
}
