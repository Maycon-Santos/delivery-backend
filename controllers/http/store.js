import StoresModel from "../../models/stores.js";

export default async function storeController(req, res) {
  const { store_id: storeID } = req.params;

  const store = await StoresModel.getByID(storeID);

  res.send({
    success: true,
    data: {
      id: store.id,
      name: store.name,
    },
  });
}
