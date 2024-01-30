import jwt from "jsonwebtoken";
import DeliveryManModel from "../../models/deliveryman.js";
import { compare } from "../../utils/encrypt.js";
import { SECRET_KEY } from "../../data/config.js";

export default async function loginDeliverymanController(req, res) {
  const { email, password } = req.body;

  const user = await DeliveryManModel.getByEmail(email);

  if (!user) {
    res.send({
      success: false,
      message: "User does not exists.",
    });
    return;
  }

  if (!compare(password, user.password)) {
    res.send({
      success: false,
      message: "Password is wrong.",
    });
    return;
  }

  const token = jwt.sign(
    { data: { id: user.id, userType: "deliveryman" } },
    SECRET_KEY
  );

  res.send({ success: true, token });
}
