import * as Yup from 'yup';
import Shop from '../models/Shop.js';
import Error from '../errors/errors.js';

class ShortnerController {
  async index(req, res) {
    const { short_url } = req.params;

    const shop = await Shop.findOne({where:{short_url}});
    if (shop) {
      const {id} = shop;
      return res.json({id});
    }
    return res.json({ error: 'Shop not found' });
  }
}

export default new ShortnerController();
