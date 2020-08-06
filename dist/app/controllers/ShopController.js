"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _Shop = _interopRequireDefault(require("../models/Shop"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class ShopController {
  getrandom() {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  async index(req, res) {
    const {
      shop_id
    } = req.body;
    const shop = await _Shop.default.findByPk(shop_id);

    if (shop) {
      const {
        retail_id,
        name,
        manager,
        phone,
        short_url
      } = shop;
      return res.json({
        retail_id,
        name,
        manager,
        phone,
        short_url
      });
    }

    return res.json({
      error: 'Shop not found'
    });
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
      short_url: Yup.string().required() // short_url: Yup.string().required(),

    }); // console.log(req.body);

    if (!(await schema.isValid({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      short_url: req.body.short_url // short_url: get,

    }))) {
      // console.log('bad schema for ShopController');
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    } // const shopExists = await Shop.findOne({
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


    const {
      id,
      name,
      manager,
      phone,
      short_url
    } = await _Shop.default.create({
      name: req.body.name,
      phone: req.body.phone,
      manager: req.body.manager,
      retail_id: req.body.retail_id,
      short_url: req.body.short_url
    });
    return res.json({
      id,
      name,
      manager,
      phone,
      short_url
    });
  } // async update(req, res) {
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

var _default = new ShopController();

exports.default = _default;