import "dotenv/config";
import express from "express";
// Equivalente: const ExpressWs = require('express-ws')
import ExpressWs from "express-ws";
import cors from "cors";
import registerUserController from "./controllers/http/register-user.js";
import loginUserController from "./controllers/http/login-user.js";
import registerStoreController from "./controllers/http/register-store.js";
import loginStoreController from "./controllers/http/login-store.js";
import addMenuController from "./controllers/http/add-menu.js";
import authMiddleware from "./middlewares/http/auth.js";
import { SERVER_PORT } from "./data/config.js";
import addItemsController from "./controllers/http/add-items.js";
import removeItemController from "./controllers/http/remove-item.js";
import removeMenuController from "./controllers/http/remove-menu.js";
import menusController from "./controllers/http/menus.js";
import itemsController from "./controllers/http/items.js";
import consumerWSController from "./controllers/ws/consumer.js";
import allowUserTypesMiddleware from "./middlewares/http/allowUserTypes.js";
import getOrderController from "./controllers/http/get-order.js";
import registerDeliveryManController from "./controllers/http/register-deliveryman.js";
import loginDeliverymanController from "./controllers/http/login-deliveryman.js";
import updateOrderStatusController from "./controllers/http/update-order-status.js";
import storesController from "./controllers/http/stores.js";
import menusItemsController from "./controllers/http/menus-items.js";
import ordersController from "./controllers/http/oders.js";
import deliverymanWSController from "./controllers/ws/deliveryman.js";
import authMiddlewareWs from "./middlewares/ws/auth.js";
import storeWSController from "./controllers/ws/store.js";
import allowUserTypesMiddlewareWs from "./middlewares/ws/allowUserTypes.js";

const app = express();
const expressWs = ExpressWs(app);

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

// User
app.post("/register-user", registerUserController);
app.post("/login-user", loginUserController);

// Store
app.post("/register-store", registerStoreController);
app.post("/login-store", loginStoreController);

// Deliveryman
app.post("/register-deliveryman", registerDeliveryManController);
app.post("/login-deliveryman", loginDeliverymanController);

app.get("/stores", storesController);

// Menu
app.post(
  "/add-menu",
  // Adiciona o middleware responsável pela autenticação e recuperação dos dados do cliente logado
  authMiddleware,
  // Adiciona o middleware responsável por bloquear a rota para usuários que não estão na lista de parâmetros
  allowUserTypesMiddleware("store"),
  // Adiciona o controller responsável por validar e processar os dados que serão adicionados no banco
  addMenuController
);
app.delete(
  "/remove-menu/:menu_id",
  // Adiciona o middleware responsável pela autenticação e recuperação dos dados do cliente logado
  authMiddleware,
  // Adiciona o middleware responsável por bloquear a rota para usuários que não estão na lista de parâmetros
  allowUserTypesMiddleware("store"),
  // Adiciona o controller responsável por validar e processar os dados que serão removidos no banco
  removeMenuController
);
app.get("/menus/:store_id", menusController);
app.get("/menus-items/:store_id", menusItemsController);

// Items
app.post(
  "/add-items",
  authMiddleware,
  allowUserTypesMiddleware("store"),
  addItemsController
);
app.delete(
  "/remove-item/:item_id",
  authMiddleware,
  allowUserTypesMiddleware("store"),
  removeItemController
);
app.get("/items/:menu_id", itemsController);

// Orders
app.get(
  "/get-order/:order_id",
  authMiddleware,
  allowUserTypesMiddleware("consumer"),
  getOrderController
);
app.get("/orders", authMiddleware, ordersController);

// Update order status
app.post(
  "/update-order-status",
  authMiddleware,
  allowUserTypesMiddleware("store", "deliveryman"),
  updateOrderStatusController
);

// Web Socket
app.ws(
  "/consumer",
  authMiddlewareWs,
  allowUserTypesMiddlewareWs("consumer"),
  consumerWSController
);
app.ws(
  "/store",
  authMiddlewareWs,
  allowUserTypesMiddlewareWs("store"),
  storeWSController
);
app.ws(
  "/deliveryman",
  authMiddlewareWs,
  allowUserTypesMiddlewareWs("deliveryman"),
  deliverymanWSController
);

// Inicia o servidor ouvindo na porta "SERVER_PORT"
app.listen(SERVER_PORT, () => {
  console.log(`Servidor ouvindo na porta ${SERVER_PORT}`);
});
