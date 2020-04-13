import * as Yup from 'yup';
import Shop from '../models/Shop';
import Error from '../errors/errors';

class AllShopController {

  async index(req, res) {
    const { retail_id } = req.body;
    console.log("retail_id: ",retail_id);
    const shop = await Shop.findAll(
    { attributes: ['id', 'retail_id', 'name','manager','phone','short_url'] },
    { where: { retail_id: req.body.retail_id } }
    )
    // .map(el => el.get({ plain: true }))
    .filter(s => s.retail_id === req.body.retail_id);
    console.log(shop);
    if (!shop) {
        return res.status(400).json({ error: "no shops found for this retail" });
    }
    return res.json(shop);
  }

}

export default new AllShopController();
