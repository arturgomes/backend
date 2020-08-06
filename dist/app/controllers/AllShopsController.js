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

class AllShopController {
  async index(req, res) {
    const {
      retail_id
    } = req.body;
    console.log("retail_id: ", retail_id);
    const shop = await _Shop.default.findAll({
      attributes: ['id', 'retail_id', 'name', 'manager', 'phone', 'short_url']
    }, {
      where: {
        retail_id: req.body.retail_id
      }
    }) // .map(el => el.get({ plain: true }))
    .filter(s => s.retail_id === req.body.retail_id);
    console.log(shop);

    if (!shop) {
      return res.status(400).json({
        error: "no shops found for this retail"
      });
    }

    return res.json(shop);
  }

}

var _default = new AllShopController();

exports.default = _default;