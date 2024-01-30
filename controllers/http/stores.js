import StoresModel from "../../models/stores.js";

export default async function storesController(req, res) {
  const stores = await StoresModel.getAll();

  const sanitizedStores = stores.map(({ id, name }) => ({
    id,
    name,
  }));

  res.send({ success: true, data: sanitizedStores });
}
