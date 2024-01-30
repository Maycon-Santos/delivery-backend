import ItemsModel from "../../models/items.js";
import MenusModel from "../../models/menus.js";
import StoresModel from "../../models/stores.js";
import { sendError } from "../../utils/httpResponse.js";

export default async function menusItemsController(req, res) {
  const { store_id: storeID } = req.params;

  const store = await StoresModel.getByID(storeID);

  if (!store) {
    sendError(res, 404, "Store does not exists.");
    return;
  }

  const menus = await MenusModel.getAllByStoreID(storeID);

  const menusItems = await Promise.all(
    menus.map(async (menu) => {
      const items = await ItemsModel.getAllByMenuID(menu.id);

      return {
        menu_id: menu.id,
        menu_name: menu.name,
        items: items.map(({ id, name, price }) => ({
          id,
          name,
          price,
        })),
      };
    })
  );

  res.send(menusItems);
}
