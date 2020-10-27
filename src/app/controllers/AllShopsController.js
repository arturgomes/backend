import * as Yup from 'yup';
import Shop from '../models/Shop.js';
import Error from '../errors/errors.js';

class AllShopController {

  async index(req, res) {
    const { retail_id } = req.body;
    await Shop.findAll(
      {
        attributes: ['id', 'retail_id', 'name', 'manager', 'phone', 'short_url'] ,
        where: { retail_id }
      }
    ).then(
      shop => {
        if (!shop) {
          return res.status(400).json({ error: "no shops found for this retail" });
        }
        return res.status(200).json(shop);
      }
    ).catch(
      err => console.log(err)
    )
  }

}

export default new AllShopController();
