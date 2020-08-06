"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var Yup = _interopRequireWildcard(require("yup"));

var _Retail = _interopRequireDefault(require("../models/Retail"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

class RetailController {
  async index(req, res) {
    const {
      retail_id
    } = req.params;
    const retail = await _Retail.default.findByPk({
      retail_id
    });
    return res.json(retail);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      cnpj: Yup.string().required(),
      phone: Yup.string().required(),
      address_street: Yup.string().required(),
      address_number: Yup.string().required(),
      address_neighb: Yup.string(),
      address_city: Yup.string().required(),
      address_state: Yup.string().required(),
      address_zip: Yup.string().required(),
      address_comp: Yup.string() // address_country: Yup.string().required(),

    });

    if (!(await schema.isValid({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
      cnpj: req.body.cnpj,
      address_street: req.body.address_street,
      address_number: req.body.address_number,
      address_city: req.body.address_city,
      address_state: req.body.address_state,
      address_zip: req.body.address_zip,
      address_neighb: req.body.address_neighb,
      address_comp: req.body.address_comp // address_country: req.body.address_country,

    }))) {
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    }

    const retailEx = await _Retail.default.findOne({
      where: {
        email: req.body.email
      }
    }); // const userEx = await User.findOne({ where: { email: req.body.email } });

    if (retailEx) {
      return res.status(400).json({
        error: _errors.default.email_already_used
      });
    }

    const retailExists = await _Retail.default.findOne({
      where: {
        cnpj: req.body.cnpj
      }
    });

    if (retailExists) {
      return res.status(400).json({
        error: _errors.default.shop_exists
      });
    }

    const {
      id,
      name,
      email,
      cnpj
    } = await _Retail.default.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cnpj: req.body.cnpj,
      phone: req.body.phone,
      address_street: req.body.address_street,
      address_number: req.body.address_number,
      address_city: req.body.address_city,
      address_state: req.body.address_state,
      address_zip: req.body.address_zip,
      address_neighb: req.body.address_neighb,
      address_comp: req.body.address_comp // address_country: req.body.address_country,

    });
    return res.json({
      id,
      name,
      email,
      cnpj
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      cnpj: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => oldPassword ? field.required() : field),
      confirmPassword: Yup.string().when('password', (password, field) => password ? field.required().oneOf([Yup.ref('password')]) : field)
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({
        error: _errors.default.validation_failed
      });
    }

    const {
      cnpj,
      email,
      oldPassword
    } = req.body;
    const retail = await _Retail.default.findByPk(req.shopId);

    if (cnpj !== retail.cnpj) {
      const retailExists = await _Retail.default.findOne({
        where: {
          cnpj
        }
      });

      if (retailExists) {
        return res.status(400).json({
          error: _errors.default.shop_exists
        });
      }
    }

    if (oldPassword && !(await retail.checkPassword(oldPassword))) {
      return res.status(401).json({
        error: _errors.default.invalid_password
      });
    }

    const {
      id,
      name
    } = await retail.update(req.body);
    return res.json({
      id,
      name,
      email,
      cnpj
    });
  }

}

var _default = new RetailController();

exports.default = _default;