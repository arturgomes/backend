import * as Yup from 'yup';
import Shop from '../models/Shop.js';
import Error from '../errors/errors.js';

class ShopController {

  getrandom(){
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }
  async index(req, res) {
    const { shop_id } = req.body;

    const shop = await Shop.findByPk(shop_id);
    if (shop) {
      const {retail_id,name,manager,phone,short_url} = shop;
      return res.json({retail_id,name,manager,phone,short_url});
    }
    return res.json({ error: 'Shop not found' });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      // address_street: Yup.string().required(),
      // address_number: Yup.string().required(),
      // address_comp: Yup.string().required(),
      // address_neighb: Yup.string().required(),
      // address_city: Yup.string().required(),
      // address_state: Yup.string().required(),
      // address_zip: Yup.string().required(),
      // address_country: Yup.string().required(),
      manager: Yup.string().required(),
      phone: Yup.string().required(),
      short_url: Yup.string().required(),
      // short_url: Yup.string().required(),
    });
    // console.log(req.body);
    if (
      !(await schema.isValid({
        name: req.body.name,
        phone: req.body.phone,
        manager: req.body.manager,
        short_url: req.body.short_url,
        // short_url: get,
      }))
    ) {
      // console.log('bad schema for ShopController');
      return res.status(400).json({ error: Error.validation_failed });
    }

    // const shopExists = await Shop.findOne({
    //   where: { cnpj: req.body.cnpj },
    // });

    // if (shopExists) {
    //   return res.status(400).json({ error: Error.shop_exists });
    // }
    // const usr = await User.findOne({ where: { id: req.userId } });
    // if (usr) {
    //   return res.status(400).json({ error: Error.user_cannot_create_shop });
    // }
    // const short_url = this.getrandom();
    const { id, name, manager, phone,short_url } = await Shop.create({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      retail_id: req.body.retail_id,
      short_url: req.body.short_url,
    });

    return res.json({ id, name, manager, phone, short_url });
  }
  async delete(req,res){
    const id = req.params.id;

    const file = await Shop.findOne({ where: { id} });
    file.destroy();

    return res.status(200).json({
      message: 'Shop deleted',
    });
  }

}

export default new ShopController();
