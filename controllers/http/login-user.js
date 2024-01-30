import jwt from "jsonwebtoken";
import isEmail from "validator/lib/isEmail.js";
import UsersModel from "../../models/users.js";
import { compare } from "../../utils/encrypt.js";
import { SECRET_KEY } from "../../data/config.js";
import { sendError } from "../../utils/httpResponse.js";
import {
  INVALID_EMAIL,
  PASSWORD_WRONG,
  USER_DOES_NOT_EXISTS,
} from "../../data/errorTypes.js";

export default async function loginUserController(req, res) {
  const { email, password } = req.body;

  if (!isEmail(email)) {
    sendError(res, 401, "Email is invalid.", INVALID_EMAIL);
    return;
  }

  const user = await UsersModel.getByEmail(email);

  if (!user) {
    sendError(res, 401, "User does not exist.", USER_DOES_NOT_EXISTS);
    return;
  }

  if (!(await compare(password, user.password))) {
    sendError(res, 401, "Passord is wrong.", PASSWORD_WRONG);
    return;
  }

  const token = jwt.sign(
    { data: { id: user.id, userType: "consumer" } },
    SECRET_KEY
  );

  res.send({ success: true, token });
}
