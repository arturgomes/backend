"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Feedback = _interopRequireDefault(require("../models/Feedback"));

var _Shop = _interopRequireDefault(require("../models/Shop"));

var _perguntas = _interopRequireDefault(require("../feedbacks/perguntas"));

var _errors = _interopRequireDefault(require("../errors/errors"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import * as Yup from 'yup';
// import User from '../models/User';
class FeedbackController {
  async index(req, res) {
    const {
      shop_id
    } = req.params;
    const shop = await _Shop.default.findOne({
      where: {
        id: shop_id
      }
    });

    if (shop) {
      return res.json((0, _perguntas.default)(shop.name));
    }

    return res.json({
      error: 'Shop not found'
    });
  }

  async store(req, res) {
    const {
      shop_id
    } = req.params;
    const {
      nps,
      com
    } = req.body.answers;
    const shop = await _Shop.default.findByPk(shop_id);

    if (shop.id !== shop_id) {
      return res.status(401).json({
        error: _errors.default.invalid_shop
      });
    }

    const response = await _Feedback.default.create({
      date: Date.now(),
      user_id: null,
      // userExists.id,
      shop_id: shop.id,
      nps_value: nps,
      retail_id: shop.retail_id,
      comment_optional: com
    });
    const fid = response.id;
    return res.json({
      fid
    });
  }

}

var _default = new FeedbackController();

exports.default = _default;