"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }// import * as Yup from 'yup';
var _Feedback = require('../models/Feedback'); var _Feedback2 = _interopRequireDefault(_Feedback);
var _Shop = require('../models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
// import User from '../models/User';
var _perguntas = require('../feedbacks/perguntas'); var _perguntas2 = _interopRequireDefault(_perguntas);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class FeedbackController {
  async index(req, res) {
    const { shop_id } = req.params;

    const shop = await _Shop2.default.findOne({ where: { id: shop_id } });
    if (shop) {
      return res.json(_perguntas2.default.call(void 0, shop.name));
    }
    return res.json({ error: 'Shop not found' });
  }

  async store(req, res) {
    const { shop_id } = req.params;
    const { nps, com } = req.body.answers;

    const shop = await _Shop2.default.findByPk(shop_id);

    if (shop.id !== shop_id) {
      return res.status(401).json({ error: _errors2.default.invalid_shop });
    }

    const response = await _Feedback2.default.create({
      date: Date.now(),
      user_id: null, // userExists.id,
      shop_id: shop.id,
      nps_value: nps,
      retail_id:shop.retail_id,
      comment_optional: com,
    });
    const fid = response.id;
    return res.json({ fid });
  }
}

exports. default = new FeedbackController();
