import * as Yup from 'yup';
import Shop from '../models/Shop.js';
import Error from '../errors/errors.js';

class ShopController {

  // getrandom(){
  //   let text = "";
  //   const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  //   for (let i = 0; i < 5; i++)
  //       text += possible.charAt(Math.floor(Math.random() * possible.length));
  //   return text;
  // }
  async index(req, res) {
    const { shop_id } = req.body;

    const shop = await Shop.findByPk(shop_id);
    if (shop) {
      const { retail_id, name, manager, phone, short_url } = shop;
      return res.json({ retail_id, name, manager, phone, short_url });
    }
    return res.json({ error: 'Shop not found' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      manager: Yup.string().required(),
      phone: Yup.string().required(),
      retail_id: Yup.string().required(),
      short_url: Yup.string().required(),
    });
    if (
      !(await schema.isValid({
        name: req.body.name,
        phone: req.body.phone,
        manager: req.body.manager,
        retail_id: req.body.retail_id,
        short_url: req.body.short_url,
      }))
    ) {
      return res.status(400).json({ error: Error.validation_failed });
    }

    // const { id, name, manager, phone, short_url } = await Shop.create({
    await Shop.create({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      retail_id: req.body.retail_id,
      short_url: req.body.short_url,
    })
      .then(new_shop => {
        return res.status(200).json({ message: "shop added" })
      })
      .catch(error => {
        return res.status(500).json(error)
      })

  }
  async delete(req, res) {
    const { shop_id } = req.body;

    const shop = await Shop.findByPk(shop_id);
    await shop.destroy();

    return res.status(200).json({
      message: 'Shop deleted',
    });
  }

}

export default new ShopController();
