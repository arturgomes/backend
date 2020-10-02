import * as Yup from 'yup';
import Shop from '../models/Shop.js';
import Error from '../errors/errors.js';

class AllShopController {

  async index(req, res) {
    const { retail_id } = req.body;
    console.log("retail_id: ", retail_id);
    await Shop.findAll(
      {
        attributes: ['id', 'retail_id', 'name', 'manager', 'phone', 'short_url'] ,
        where: { retail_id }
      }
    ).then(
      shop => {
        const shops = shop;//shop.map(el => el.get({ plain: true })) .filter(s => s.retail_id === retail_id);

        console.log(shops);
        if (!shops) {
          return res.status(400).json({ error: "no shops found for this retail" });
        }
        return res.json(shops);
      }
    ).catch(
      err => console.log(err)
    )


  }

}

export default new AllShopController();
