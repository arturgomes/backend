"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Shop = _interopRequireDefault(require("../models/Shop"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QrController {
  async index(req, res) {
    // console.log("retail_id: ",req.body.retail_id)
    const shops = await _Shop.default.findAll({
      attributes: ['id', 'retail_id', 'name', 'short_url']
    }, {
      where: {
        retail_id: req.body.retail_id
      }
    }) // .map(el => el.get({ plain: true }))
    .filter(s => s.retail_id === req.body.retail_id); // console.log(shops);

    if (shops !== null) return res.json(shops); // if (fbs) {
    //   return res.json(fbs);
    // }

    return res.json({
      error: 'Shop not found'
    });
  }

}

var _default = new QrController();

exports.default = _default;