"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Shop = require('../models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

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

    const shop = await _Shop2.default.findByPk(shop_id);
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
      return res.status(400).json({ error: _errors2.default.validation_failed });
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
    const { id, name, manager, phone,short_url } = await _Shop2.default.create({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      retail_id: req.body.retail_id,
      short_url: req.body.short_url,
    });

    return res.json({ id, name, manager, phone, short_url });
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

exports. default = new ShopController();
