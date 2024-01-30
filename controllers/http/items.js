import ItemsModel from "../../models/items.js";

export default async function itemsController(req, res) {
  const { menu_id } = req.params;

  const items = await ItemsModel.getAllByMenuID(menu_id);

  res.send({
    success: true,
    result: items.map(({ id, name, price }) => {
      return { id, name, price };
    }),
  });
}
