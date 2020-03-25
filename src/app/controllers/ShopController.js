import * as Yup from 'yup';
import Shop from '../models/Shop';
import Error from '../errors/errors';


class ShopController {

  getrandom() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

  async index(req, res) {
    const { shop_id } = req.params;

    const shop = await Shop.findOne({ where: { id: shop_id } });
    if (shop) {
      return res.json(shop.name);
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
    });
    console.log(req.body);
    if (
      !(await schema.isValid({
        name: req.body.name,
        phone: req.body.phone,
        manager: req.body.manager,
      }))
    ) {
      console.log('bad schema for ShopController');
      return res.status(400).json({ error: Error.validation_failed });
    }

    // let valid_url = true;
    // let ur;
    // while (valid_url !== false){
    //   ur = this.getrandom();
    //   const shop_ur = await Shop.findOne({ where: { short_url: ur } });
    //   if(!shop_ur){
    //     valid_url = false;
    //   }
    // }
    // console.log(ur);

    const { id, name, manager, phone } = await Shop.create({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      retail_id: req.body.retail_id,
      // short_url:ur
    });

    return res.json({ id, name, manager, phone });
  }

  // async update(req, res) {
  //   const schema = Yup.object().shape({
  //     cnpj: Yup.string(),
  //     email: Yup.string().email(),
  //     oldPassword: Yup.string().min(6),
  //     password: Yup.string()
  //       .min(6)
  //       .when('oldPassword', (oldPassword, field) =>
  //         oldPassword ? field.required() : field
  //       ),
  //     confirmPassword: Yup.string().when('password', (password, field) =>
  //       password ? field.required().oneOf([Yup.ref('password')]) : field
  //     ),
  //   });

  //   if (!(await schema.isValid(req.body))) {
  //     return res.status(400).json({ error: Error.validation_failed });
  //   }

  //   const { cnpj, email, oldPassword } = req.body;

  //   const shop = await Shop.findByPk(req.shopId);

  //   if (cnpj !== shop.cnpj) {
  //     const shopExists = await Shop.findOne({ where: { cnpj } });

  //     if (shopExists) {
  //       return res.status(400).json({ error: Error.shop_exists });
  //     }
  //   }

  //   if (oldPassword && !(await shop.checkPassword(oldPassword))) {
  //     return res.status(401).json({ error: Error.invalid_password });
  //   }

  //   const { id, name } = await shop.update(req.body);

  //   return res.json({ id, name, email, cnpj });
  // }
}

export default new ShopController();
