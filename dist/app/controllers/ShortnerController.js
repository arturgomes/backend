"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Shop = require('../models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class ShortnerController {
  async index(req, res) {
    const { short_url } = req.params;

    const shop = await _Shop2.default.findOne({where:{short_url}});
    if (shop) {
      const {id} = shop;
      return res.json({id});
    }
    return res.json({ error: 'Shop not found' });
  }
}

exports. default = new ShortnerController();
