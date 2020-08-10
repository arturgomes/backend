"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Coupon = require('../models/Coupon'); var _Coupon2 = _interopRequireDefault(_Coupon);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class CouponController {
  async index(req, res) {
    const { retail_id } = req.params;
    const coupons = await _Coupon2.default.findAll({ where: { retail_id } })
      .filter(s => s.retail_id === req.params.retail_id);
    // console.log("Cupons: ",coupons)

    if (!coupons) {
      return res.status(400).json({ error: "no coupons found for this retail" });
    }
    return res.json(coupons);
  }

  async store(req, res) {
    // console.log("req",req.body)
    // const schema = Yup.object().shape({
    //   name: Yup.string().required(),
    //   descricao: Yup.string().required(),
    //   discount: Yup.string().required(),
    //   expDate: Yup.string().required(),
    //   retail_id: Yup.string().required(),
    // });

    const validation = {
      retail_id: req.body.retail_id,
      name: req.body.name,
      feedcoins: req.body.feedcoins,
      description: req.body.descricao,
      loyalty: req.body.loyalty,
      discount: req.body.discount,
      expire_date: req.body.expDate,
    };

    console.log("passou no schema", validation);
    // if (
    //   !(await schema.isValid(validation))
    // ) {
    //   console.log("error",Error.validation_failed);
    //   return res.status(400).json({ error: Error.validation_failed });
    // }

    // console.log("passou no yup");
    await _Coupon2.default.create(validation)
      .then(response => { console.log(response) })
      .catch(error => { console.log(error) });
    if (!coupon) {
      return res.status(400).json({ error: "Cupom não criado" })
    }
    console.log("id: ", coupon);
    return res.json(coupon);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      description: Yup.string().required(),
      discount: Yup.string().required(),
      expireDate: yup.date().required()
    });

    if (
      !(await schema.isValid({
        name: req.body.name,
        description: req.body.description,
        discount: req.body.discount,
        expireDate: req.body.expireDate,
      }))
    ) {
      return res.status(400).json({ error: _errors2.default.validation_failed });
    }

    const { name, description, discount, expireDate } = req.body;

    const coupon = await _Coupon2.default.findOne({ where: { name } });

    const { id, name: name_i } = await coupon.update(req.body);

    return res.json({ id, name_i, email, cnpj });
  }
}

exports. default = new CouponController();
