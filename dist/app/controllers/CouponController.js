"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _Coupon = _interopRequireDefault(require("../models/Coupon"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class CouponController {
  async index(req, res) {
    const {
      retail_id
    } = req.params;
    const coupons = await _Coupon.default.findAll({
      where: {
        retail_id
      }
    }).filter(s => s.retail_id === req.params.retail_id); // console.log("Cupons: ",coupons)

    if (!coupons) {
      return res.status(400).json({
        error: "no coupons found for this retail"
      });
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
      expire_date: req.body.expDate
    };
    console.log("passou no schema", validation); // if (
    //   !(await schema.isValid(validation))
    // ) {
    //   console.log("error",Error.validation_failed);
    //   return res.status(400).json({ error: Error.validation_failed });
    // }
    // console.log("passou no yup");

    await _Coupon.default.create(validation).then(response => {
      console.log(response);
    }).catch(error => {
      console.log(error);
    });

    if (!coupon) {
      return res.status(400).json({
        error: "Cupom não criado"
      });
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

    if (!(await schema.isValid({
      name: req.body.name,
      description: req.body.description,
      discount: req.body.discount,
      expireDate: req.body.expireDate
    }))) {
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    }

    const {
      name,
      description,
      discount,
      expireDate
    } = req.body;
    const coupon = await _Coupon.default.findOne({
      where: {
        name
      }
    });
    const {
      id,
      name: name_i
    } = await coupon.update(req.body);
    return res.json({
      id,
      name_i,
      email,
      cnpj
    });
  }

}

var _default = new CouponController();

exports.default = _default;