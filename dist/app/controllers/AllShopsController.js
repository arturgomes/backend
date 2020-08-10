"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _yup = require('yup'); var Yup = _interopRequireWildcard(_yup);
var _Shop = require('../models/Shop'); var _Shop2 = _interopRequireDefault(_Shop);
var _errors = require('../errors/errors'); var _errors2 = _interopRequireDefault(_errors);

class AllShopController {

  async index(req, res) {
    const { retail_id } = req.body;
    console.log("retail_id: ",retail_id);
    const shop = await _Shop2.default.findAll(
    { attributes: ['id', 'retail_id', 'name','manager','phone','short_url'] },
    { where: { retail_id: req.body.retail_id } }
    )
    // .map(el => el.get({ plain: true }))
    .filter(s => s.retail_id === req.body.retail_id);
    console.log(shop);
    if (!shop) {
        return res.status(400).json({ error: "no shops found for this retail" });
    }
    return res.json(shop);
  }

}

exports. default = new AllShopController();
