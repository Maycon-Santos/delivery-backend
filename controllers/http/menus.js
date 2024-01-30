import MenusModel from "../../models/menus.js";

export default async function menusController(req, res) {
  const { store_id } = req.params;

  const menus = await MenusModel.getAllByStoreID(store_id);

  res.send({
    success: true,
    result: menus.map(({ id, name }) => {
      return { id, name };
    }),
  });
}
